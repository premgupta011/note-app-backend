import express from 'express'
import mongoose from "mongoose";
import { User } from '../models/user.js';
import bcrypt from'bcrypt'
import jwt from 'jsonwebtoken';
import cookieparser from 'cookie-parser'
import authenticate from '../config/utils.js';
import Notes from '../models/notes.js';

export const signup = async (req, res)=>{

    const {name, email, password} = req.body;
    try{
        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({message:"user already exist"})
        } 
            if(!name){return res.json({message:"Provide name"})}
            if(!email){return res.json({message: "email required"})}
            if(!password){return res.json({message: "password required"})}
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            await user.save();
            const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn:'7d'})

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7*24*60*60*1000
            })

            return res.json({message: "user registered successfully!!!",token, user});
        
    } catch(error){
        res.status(500).json({message:"Internal server error"});
    }


}

export const login = async (req, res)=>{
    const {email, password} = req.body;
    const username = "";
    try{
        const existing = await User.findOne({email});
        if(!existing){
            return res.json({message: "invalid user"})
        }
        if(existing){
            const isMatched = await bcrypt.compare(password, existing.password);
            
            if(!isMatched){
                return res.json({message: "invalid password"})
            }
            if(isMatched){
                const token = jwt.sign({id: existing._id}, process.env.SECRET_KEY, {expiresIn:'7d'})

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7*24*60*60*1000
            })
                return res.json({message: "logged in !!!", name: existing.name});
            }
        }
    } catch(error){
        return res.json({message:"error"})
        
    }
}

export const logout = async (req, res)=>{
    try{
       await res.clearCookie('token', {
             httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7*24*60*60*1000
        })
        return res.json({message: "logged out successfully !!!"})
    } catch(error){
        return res.json({message:"error"})
    }
}


export const addNote = async (req,  res)=>{

    const {title, description} = req.body;
    try{
        if(!title){
            return res.json({message: "title is required"})
        }
        if(!description){
            return res.json({message: "description is required"})
        }
        const note = new Notes({
            title,
            description,
            id: req.user.id,
        })
        await note.save();
        return res.json({message: "note added successfullly!!!", note})
    } catch(error){
        return res.json({message: "cannot add the note"})
    }
}

export const getNote = async (req, res)=>{
    const userId = req.user.id;
    const notes = await Notes.find({id: userId});
    try{
        if(notes){
            return res.json({message:"notes fetched successfully!!!" ,notes})
        }

    } catch(error){
        return res.json({message: "failed to fetch noted"})
    }
}
export const deleteNote = async (req, res)=>{
    const userId = req.user.id;
    const noteId = req.params.id;
    try{
        const note = Notes.findOne({id: userId, _id: noteId});
        if(!note){
            return res.json({message: "note not available or unauthorized"});
        }
        await note.deleteOne({_id:noteId});
        return res.json({message: "successfully deleted the noter"})
    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }

}

export const editNote = async(req, res)=>{
    const userId = req.user.id;
    const noteId = req.params.id;
    const {title, description} = req.body;
    try{
        const note = await Notes.findOne({id: userId, _id: noteId});
        if(!note){
            return res.json({message: "note not found or unauthorized"});
        }
        note.title = title;
        note.description = description;
        const updatedNote =  await note.save();
        return res.json({message: "note has been updated successfully", updatedNote})
    }catch(error){
        res.json({message: "Internal server error"});
    }

}