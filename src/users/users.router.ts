import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { create, getAll, getById, remove, update } from "./users.service";

export const router = express.Router();


router.get("/", async (_req: Request, res: Response) => {
  const users = await getAll();  
  res.status(200).json(users);
});


router.get("/:id", async (req: Request, res: Response) => {
  const user = await getById(req.params.id)

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json(user);
});


const validationPost = [
  body("username").notEmpty().exists(),
  body("email").notEmpty().isEmail().exists(),
  body("name").notEmpty().exists(),
  body("password").notEmpty().exists().isLength({ min: 3 }),
];
type RequestPost = Request<{id: string}, unknown, {username: string, email: string, name: string, password: string}>;

router.post("/", validationPost, async (req: RequestPost, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ error: validationRes.array() });
  }

  try {

    const result = await create(req.body.username, req.body.email, req.body.name, req.body.password)
    return res.status(201).json(result);
    
  } catch(error: unknown) {
    if(error instanceof RangeError) {
      return res.status(409).json({ error });
    }
  }
});


const validationPut = [
  body("name").isString().notEmpty().exists(),
  body("email").isEmail().notEmpty().exists(),
];
type RequestPut = Request<{id: string}, unknown, {name: string, email: string}>;

router.put("/:id", validationPut, async (req: RequestPut, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ errors: validationRes.array() });
  }

  const result = await update(req.params.id, req.body.name, req.body.email);
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(200).json(result);
});


router.delete("/:id", async (req: Request, res: Response) => {
  const result = await remove(req.params.id)

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(204).json();
});


router.get("/:id/orders", async (req: Request, res: Response) => {
  throw new Error('NOT IMPLEMENTED')
  // const user = await getById(req.params.id)
  // if (!user) return res.status(404).json({ error: "user not found" });

  // const userOrders = getByUserId(user.id);
  // return res.status(200).json(userOr ders);
});