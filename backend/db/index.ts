import dotenv from "dotenv";
import knex from "knex";
import knexfile from "./knexfile";
dotenv.config();

const pool = knex(knexfile[process.env.NODE_ENV || "development"]);

export default pool;
