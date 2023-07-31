import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { signin } from "./auth.service";

export const router = express.Router();


const validationSignin = [
  body("username").notEmpty().exists(),
  body("password").notEmpty().exists(),
];
type RequestSignin = Request<{}, unknown, {username: string, password: string}>;

router.post("/signin", validationSignin, async (req: RequestSignin, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ error: validationRes.array() });
  }

  const token = signin(req.body.username, req.body.password)
  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  res.status(200).json({ token });
});