import { ObjectId } from "mongodb";

export type Unit = {
  _id?: ObjectId;
  slug: string;
  unit: string;
  abbreviation: string;
  location: string;

  role: string;
  description: string;
  fullDescription: string;

  responsibilities: string[];
  aircraft?: string[];

  parentCommand?: string;

  logo?: string; // Cloudinary URL

  gallery?: {
    image: string;
    caption: string;
    uploadedAt: Date;
  }[];

  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };

  links?: {
    title: string;
    url: string;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
};
