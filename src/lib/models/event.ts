// src/lib/model/event.ts
import { ObjectId } from "mongodb";

export type Event = {
  _id?: ObjectId;

  title: string;
  description?: string;

  scope: "COMMAND" | "UNIT";
  unitId?: ObjectId;

  category: "CEREMONY" | "EXERCISE" | "TRAINING" | "EVENT";

  coverImage?: string; // optional hero image

  createdAt: Date;
  updatedAt: Date;
};
