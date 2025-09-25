import express from "express";
import cors from "cors";
import pilotRoutes from './routes/pilotRoutes.js';


const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', pilotRoutes);


app.get('/', (req, res) => {
    res.redirect(301, 'https://gitpilotcli.vercel.app');
});


export default app;