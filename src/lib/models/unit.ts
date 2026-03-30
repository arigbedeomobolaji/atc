import { ObjectId } from "mongodb";

export type Unit = {
  _id?: ObjectId;

  // 🔹 Identity
  slug: string;
  unit: string;
  abbreviation: string;

  // 🔹 Location & Structure
  location: string;
  parentCommand?: string;

  // 🔹 Description
  role: string;
  description: string;
  fullDescription: string;

  // 🔥 NEW: Operational Capabilities
  capabilities?: string[];

  // 🔥 NEW: Systems / Equipment (generalized)
  systems?: string[];

  // 🔹 Operational Data
  responsibilities: string[];

  // 🔥 NEW: Establishment & Evolution
  history?: {
    date?: string;
    event: string;
  }[];

  // 🔥 NEW: Command History (CRITICAL)
  commanders?: {
    name: string;
    rank: string;
    serviceNumber?: string;
    startDate?: string;
    endDate?: string;
  }[];

  // 🔹 Media
  logo?: string;

  // 🔹 Command (current)
  currentCommanderId?: ObjectId;

  // 🔹 Contact Info
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };

  // 🔹 Links
  links?: {
    title: string;
    url: string;
  }[];

  // 🔥 FLEXIBLE EXTENSION (VERY IMPORTANT)
  customSections?: {
    title: string;
    items: string[];
  }[];

  // 🔹 Metadata
  isActive?: boolean;
  establishedDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
};

// export type Unit = {
//   _id?: ObjectId;

//   // 🔹 Identity
//   slug: string;
//   unit: string;
//   abbreviation: string;

//   // 🔹 Location & Structure
//   location: string;
//   parentCommand?: string;

//   // 🔹 Description
//   role: string;
//   description: string;
//   fullDescription: string;

//   // 🔹 Operational Data
//   responsibilities: string[];
//   aircraft?: string[];

//   // 🔹 Media
//   logo?: string; // Cloudinary

//   // 🔹 Command Structure
//   currentCommanderId?: ObjectId;

//   // 🔹 Contact Info
//   contact?: {
//     address?: string;
//     phone?: string;
//     email?: string;
//   };

//   // 🔹 External Links
//   links?: {
//     title: string;
//     url: string;
//   }[];

//   // 🔹 Metadata
//   isActive?: boolean; // 🔥 VERY IMPORTANT
//   establishedDate?: Date;

//   createdAt?: Date;
//   updatedAt?: Date;
// };
