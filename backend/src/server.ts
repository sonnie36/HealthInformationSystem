import express from 'express';
import cors from 'cors'
import {auth_router} from './router/auth.route'
import { program_router } from './router/program.router';

const app = express();

app.use(express.json());
app.use(cors())
app.use('/auth', auth_router)
app.use('/program', program_router)

const PORT = 3457;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})