// import { Document } from "mongodb"; --- not active 

export interface Car extends Document {
  name: string;
  manufacturer: string;
  maxSpeed: number;
  price: number;
}
