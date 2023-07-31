import {Document} from 'mongodb'

export interface User extends Document {
  username: string;
  name: string;
  email: string;
  spent: number;
  password: string;
  rewardPoints: number;
}