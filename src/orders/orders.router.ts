import express from "express";
import { Request, Response } from "express-serve-static-core";
import { body, param, validationResult } from "express-validator";
import { Product } from "../products";
import { addRewardPoints, getById } from "../users/users.service";
import { create, update } from "./orders.service";

export const router = express.Router();


const validationPut = [
  param("id").isString().exists(),
  body("status").notEmpty().exists().contains(["delivered"]),
];
type RequestPut = Request<{id: string}, unknown, {id: string, status: string}>;

router.put("/:id", validationPut, (req: RequestPut, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ error: validationRes.array() });
  }

  const result = update(req.params.id, req.body.status);
  if (!result) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(200).json(result);
});


const validationPost = [
  body("userId").isInt().exists(),
  body("products").isArray(),
];
type RequestPost = Request<{}, unknown, {userId: number, products: Product[]}>;

router.post("/", validationPost, (req: RequestPost, res: Response) => {
  throw new Error('NOT IMPLEMENTED')
  // const validationRes = validationResult(req);
  // if (!validationRes.isEmpty()) {
  //   return res.status(400).json({ error: validationRes.array() });
  // }

  // const user = getById(req.body.userId.toString());
  // if (!user) {
  //   return res.status(404).json({ error: "user not found" });
  // }

  // const order = create(user.id, req.body.products);
  // addRewardPoints(user.id, order.rewardPoints);

  // res.status(201).json(order);
});
