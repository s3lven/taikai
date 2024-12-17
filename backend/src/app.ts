import express from "express";
import dotenv from "dotenv";
import { Express, Request, Response } from "express";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
	res.json({ message: "Express + TypeScript Server" });
});

app.listen(port, () => {
    console.log(`[SERVER]: Server is running at http://localhost:${port}`)
})
