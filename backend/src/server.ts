import express from 'express';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors())

const PORT = 3457;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})