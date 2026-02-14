import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { config } from "./utils/app.config";
import { auth } from "./lib/auth";
import { errorHandler } from "./middlewares/error-handle.middleware";
import router from "./routes";

const BASE_PATH = config.BASE_PATH;
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://v2.vectyz.com",
  "https://v2admin.vectyz.com",
];
// const allowedOrigins = ["*"];

app.use(
  cors({
    origin: allowedOrigins, // asal frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // wajib untuk cookies
  })
);
app.set("trust proxy", 1); // important for cookie

app.use(helmet());
app.use(morgan("dev"));

app.all(`/api/auth/*vectyz`, toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// app.get("/api/me", async (req, res) => {
//   const session = await auth.api.getSession({
//     headers: fromNodeHeaders(req.headers),
//   });
//   return res.json(session);
// });

app.use(`${BASE_PATH}`, router);

app.use(errorHandler);

export default app;
