import { Document } from "mongodb";

export interface Car extends Document {
  name: string;
  manufacturer: string;
  maxSpeed: number;
  price: number;
}
