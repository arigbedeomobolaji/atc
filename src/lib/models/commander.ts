import { ObjectId } from "mongodb";

export type Commander = {
  _id?: ObjectId;

  name: string;
  rank: string;

  unitId: ObjectId;

  portrait: string; // Cloudinary

  startDate: Date;
  endDate?: Date; // null if current

  bio?: string;

  appointment: "COMMANDER" | "COMMANDANT" | "AOC";

  createdAt: Date;
};
