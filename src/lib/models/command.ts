import { ObjectId } from "mongodb";

export type Command = {
  _id?: ObjectId;

  name: string; // "HQ Air Training Command"
  abbreviation: string; // "HQ ATC"
  slug: string;

  description?: string;

  logo?: string;

  createdAt?: Date;
  updatedAt?: Date;
};
