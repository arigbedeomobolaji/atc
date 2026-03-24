export interface Command {
  _id?: string;
  name: string;
  slug: string;
  description?: string;

  aoc: {
    name: string;
    rank: string;
    image: string;
    tenureStart?: Date;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Unit {
  _id?: string;
  commandId: string;

  name: string;
  slug: string;
  abbreviation: string;

  location: string;
  role: string;
  description: string;
  fullDescription: string;

  responsibilities: string[];
  aircraft?: string[];

  image: string;

  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Gallery {
  _id?: string;

  category: string;
  unitId?: string;

  title: string;
  description: string;

  imageUrl: string;

  type?: "AOC" | "CEREMONY" | "GENERAL";
  isCurrent?: boolean;

  createdAt?: Date;
}
