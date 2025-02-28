import express from "express";
import tournamentRoutes from "./routes/tournamentRoutes";
import { errorHandler } from "./middleware/errorHandler";
import bracketRoutes from "./routes/bracketRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Routes
app.use("/tournaments", tournamentRoutes);
app.use("/brackets", bracketRoutes)

// Error Handler
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
