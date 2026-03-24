import { ObjectId } from "mongodb";

export type Gallery = {
  _id?: ObjectId;

  imageUrl: string; // Cloudinary

  caption: string;
  description?: string;

  // 🔥 VERY IMPORTANT
  scope: "COMMAND" | "UNIT";

  unitId?: ObjectId; // only if scope === "UNIT"

  category:
    | "LEADERSHIP"
    | "CEREMONY"
    | "TRAINING"
    | "EXERCISE"
    | "INFRASTRUCTURE"
    | "AIRCRAFT"
    | "EVENT"
    | "ARCHIVE";

  tags?: string[]; // e.g ["AOC", "handover", "2025"]

  uploadedBy: ObjectId;

  createdAt: Date;
};
