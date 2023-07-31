// let query = {_id: ObjectId(req.params.id)};

import {ObjectId} from 'mongodb'
import bcrypt from "bcrypt";
import { User } from "../users";
import { getDb } from '../db/mongo'
// import db from "../db";

const db = { users: [] as User[] } // TODO: DEBUG ONLY

export const getAll = async () => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  let query = {};
  const result = await collection.find<User>(query)
    .limit(50)
    .toArray();

  return result;
}


export const getById = async (id: string) => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  let query = {_id: new ObjectId(id)};
  let result = await collection.findOne<User>(query);

  return result;
}


export const getByUsername = async (username: string) => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  let query = {username};
  let result = await collection.findOne<User>(query);

  return result;
}



export const create = async (username: string, email: string, name: string, password: string) => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  const user = await getByUsername(username)

  if (user) {
    throw new RangeError("user already exists");
  }

  const hash = await bcrypt.hash(password, 12);

  const newUser: User = {
    username,
    name,
    email,
    spent: 0,
    password: hash,
    rewardPoints: 0,
  };

  return await collection.insertOne(newUser);
}


export const update = async (id: string, name: string, email: string) => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  let query = {_id: new ObjectId(id)};  
  const updates = {
    $set: {
      name,
      email,
    }
  };
  let result = await collection.updateOne(query, updates);
  return result;
}


export const remove = async (id: string) => {
  const db = await getDb();
  const collection = db.collection<User>("users");

  let query = {_id: new ObjectId(id)};
  let result = await collection.deleteOne(query);

  return result;
}


export const addRewardPoints = (id: number, rewardPoints: number) => {
  throw new Error('NOT IMPLEMENTED')
  // const user = getById(id.toString());

  // if(!user) {
  //   throw new Error(`User ID ${id} does not exist`);
  // }

  // user.rewardPoints += rewardPoints;
}