import type { Knex } from "knex"
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING || "",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING || "",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
}

export default config
