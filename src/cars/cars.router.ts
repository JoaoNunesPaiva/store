import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { Car } from "./cars.model";
import { getAll, getById, create, update, remove } from "./cars.service";

const router = express.Router();

router.get("/cars", async (req: Request, res: Response) => {
  try {
    const cars: Car[] = await getAll();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "Erro: nenhum carro encontrado." });
  }
});

router.get("/cars/:id", async (req: Request, res: Response) => {
  try {
    const car: Car | null = await getById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Erro: O carro que procurava não foi encontrado." });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Erro ao encontrar o carro." });
  }
});

const validationPost = [
  body("name").isString().notEmpty(),
  body("manufacturer").isString().notEmpty(),
  body("maxSpeed").isInt({ gt: 1 }),
  body("price").isFloat({ gt: 1 }),
];

router.post("/cars", validationPost, async (req: Request, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ errors: validationRes.array() });
  }

  try {
    const newCarData: Car = req.body;
    const newCar: Car = await create(newCarData);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: "Erro ao criar o carro." });
  }
});

const validationPut = [
  param("id").isString().notEmpty(),
  body("name").isString().notEmpty(),
  body("manufacturer").isString().notEmpty(),
  body("maxSpeed").isInt({ gt: 1 }),
  body("price").isFloat({ gt: 1 }),
];

router.put("/cars/:id", validationPut, async (req: Request, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ errors: validationRes.array() });
  }

  try {
    const updatedCarData: Car = req.body;
    const updatedCar: Car | null = await update(req.params.id, updatedCarData);
    if (!updatedCar) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar o carro." });
  }
});

router.delete("/cars/:id", async (req: Request, res: Response) => {
  try {
    const deletedCar: Car | null = await remove(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }
    res.json({ message: "Carro removido da lista." });
  } catch (err) {
    res.status(400).json({ message: "Erro ao remover o carro." });
  }
});

export default router;
