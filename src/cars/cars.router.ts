import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { create, getAll, getById, remove, update } from "./cars.service";
import { Car } from "./cars.model";

export const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const cars = await getAll();
  res.status(200).json(cars);
});

router.get("/:id", async (req: Request, res: Response) => {
  const car = await getById(req.params.id);

  if (!car) {
    return res.status(404).json({ error: "car not found" });
  }

  res.status(200).json(car);
});

const validationPost = [
  body("name").notEmpty().exists(),
  body("manufacturer").notEmpty().exists(),
  body("maxSpeed").notEmpty().isNumeric().exists(),
  body("price").notEmpty().isNumeric().exists(),
];
type RequestPost = Request<
  { id: string },
  unknown,
  {
    name: string;
    manufacturer: string;
    maxSpeed: number;
    price: number;
  }
>;

router.post("/", validationPost, async (req: RequestPost, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ error: validationRes.array() });
  }

  try {
    const result = await create(
      req.body.name,
      req.body.manufacturer,
      req.body.maxSpeed,
      req.body.price,
    );
    return res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof RangeError) {
      return res.status(409).json({ error });
    }
  }
});

const validationPut = [
  body("name").isString().notEmpty().exists(),
  body("manufacturer").isString().notEmpty().exists(),
  body("maxSpeed").notEmpty().isNumeric().exists(),
  body("price").notEmpty().isNumeric().exists(),
];
type RequestPut = Request<
  { id: string },
  unknown,
  {
    name: string;
    manufacturer: string;
    maxSpeed: number;
    price: number;
  }
>;

router.put("/:id", validationPut, async (req: RequestPut, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ errors: validationRes.array() });
  }

  const result = await update(
    req.params.id,
    req.body.name,
    req.body.manufacturer,
    req.body.maxSpeed,
    req.body.price,
  );
  if (!result) {
    return res.status(404).json({ error: "car not found" });
  }

  res.status(200).json(result);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const result = await remove(req.params.id);

  if (!result) {
    return res.status(404).json({ error: "car not found" });
  }

  res.status(204).json();
});

router.get("/:id/orders", async (req: Request, res: Response) => {
  throw new Error("NOT IMPLEMENTED");
  // const car = await getById(req.params.id)
  // if (!car) return res.status(404).json({ error: "car not found" });

  // const carOrders = getByCarId(car.id);
  // return res.status(200).json(carOrders);
});
