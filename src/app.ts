import 'reflect-metadata'

import createConnection from "./database"
import express from 'express'

createConnection();

import { router } from './routes'

const app = express();
app.use(express.json())
app.use(router);

export default app;