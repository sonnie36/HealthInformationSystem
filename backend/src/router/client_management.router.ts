import express from 'express';
import { registerClientController, getClientsController, getClientByIdController, updateClientController,searchClientsController} from '../controller/client_management.controller';

import { authenticateToken, authorizeDoctor } from '../middleware/auth.middleware';

export const client_router = express.Router();

client_router.post('/register', authorizeDoctor, registerClientController);
client_router.get('/all', authenticateToken, getClientsController);
client_router.get('/search', authenticateToken, searchClientsController);
client_router.get('/:id', authenticateToken, getClientByIdController);
client_router.put('/update/:id', authorizeDoctor, updateClientController);


