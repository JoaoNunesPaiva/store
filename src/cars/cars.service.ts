import {ObjectId} from 'mongodb'
import { Car } from "./cars.model";
import { getDb } from "../db/mongo";

const db = { cars: [] as Car[] }; // TODO: DEBUG ONLY

export const getAll = async () => {
  const db = await getDb();
  const collection = db.collection<Car>("cars");

  let query = {};
  const result = await collection.find<Car>(query)
    .limit(50)
    .toArray();

  return result;
};

export const getById = async (id: string) => {
  const db = await getDb();
  const collection = db.collection<Car>("cars");

  let query = { _id: new ObjectId(id) };
  let result = await collection.findOne<Car>(query);

  return result;
};

export const create = async (name: string, manufacturer: string, maxSpeed: number, price: number) => {
  const db = await getDb();
  const collection = db.collection<Car>("cars");

  const newCar: Car = {
    name,
    manufacturer,
    maxSpeed,
    price,
  };

  return await collection.insertOne(newCar);
};

export const update = async (id: string, name: string, manufacturer: string, maxSpeed: number, price: number) => {
  const db = await getDb();
  const collection = db.collection<Car>("cars");

  let query = { _id: new ObjectId(id) };
  const updates = {
    $set: {
      name,
      manufacturer,
      maxSpeed,
      price,
    }
  };
  let result = await collection.updateOne(query, updates);
  return result;
};

export const remove = async (id: string) => {
  const db = await getDb();
  const collection = db.collection<Car>("cars");

  let query = { _id: new ObjectId(id) };
  let result = await collection.deleteOne(query);

  return result;
};
