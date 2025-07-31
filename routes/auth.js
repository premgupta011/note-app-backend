import express from 'express'
import { Router } from 'express'
import { addNote, authCheck, deleteNote, editNote, getNote, login, logout, signup } from '../controller/auth.js';
import authenticate from '../config/utils.js';

const route = express.Router();

route.post('/signup', signup)
route.post('/login', login )
route.post('/logout', logout )
route.post('/addnote', authenticate, addNote);
route.get('/getnote', authenticate, getNote);
route.delete('/deletenote/:id', authenticate, deleteNote);
route.put('/editnote/:id', authenticate, editNote)
route.get('/auth-check', authenticate, authCheck )

export default route;