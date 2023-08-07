import express, { NextFunction, Request, Response } from "express";
import { logger } from "./logger";
import users from "./users";
import products from "./products";
import orders from "./orders";
import cars from "./cars";
import authRoutes, { authenticate as _authenticate } from "./auth";
import * as config from "./config";
const app = express();

app.use(express.json());
app.use(logger);

app.use("/auth", authRoutes);

// app.use(authenticate);

app.use("/products", products);
app.use("/users", users);
app.use("/orders", orders);
app.use("/cars", cars);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(config.PORT, () => {
  console.log("running on port ", config.PORT);
});
