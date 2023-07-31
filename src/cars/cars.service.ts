import { cars } from "../db/index";
import { Car } from "./cars.model";
// import { MongoClient } from "mongodb"; --- not active

export const getAll = () => cars;

export const getById = (id: string) => cars.find((car) => car.id === parseInt(id));

export const create = (name: string, manufacturer: string, maxSpeed: number, price: number) => {
  const newCar: Car = {
    id: (cars.length + 1).toString(),
    name,
    manufacturer,
    maxSpeed,
    price,
  };
  cars.push(newCar);

  return newCar;
};

export const update = (
  id: string,
  name: string,
  manufacturer: string,
  maxSpeed: number,
  price: number,
) => {
  const car = getById(id);

  if (!car) {
    return undefined;
  }

  car.name = name;
  car.manufacturer = manufacturer;
  car.maxSpeed = maxSpeed;
  car.price = price;

  return car;
};

export const remove = (id: string) => {
  cars = cars.filter((car) => car.id !== parseInt(id));
};
