import { ObjectId } from "mongodb";

export type Gallery = {
  _id?: ObjectId;

  images: {
    url: string;
    publicId: string;
  }[];

  caption: string;
  description?: string;

  scope: "COMMAND" | "UNIT";
  unitId?: ObjectId;

  category:
    | "LEADERSHIP"
    | "CEREMONY"
    | "TRAINING"
    | "EXERCISE"
    | "INFRASTRUCTURE"
    | "AIRCRAFT"
    | "EVENT"
    | "ARCHIVE";

  tags?: string[];
  eventId?: ObjectId;

  uploadedBy: ObjectId;

  createdAt: Date;
};
