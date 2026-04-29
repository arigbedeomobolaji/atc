import { ObjectId } from "mongodb";

export type CommandLeadership = {
  _id?: ObjectId;

  command: "HQ ATC";

  // 🔥 Identity
  name: string;
  rank: string;

  // 🔥 Appointment
  appointment: string; // Air Officer Commanding
  appointmentAbbreviation: string; // AOC, COS, CFO...

  // 🔥 Content
  bio?: string;
  awards?: string;

  // 🔥 Media
  image?: string;
  imagePublicId?: string;

  // 🔥 UI control
  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};
/* 

✅ Build the full API routes
✅ Build the admin UI (upload + edit appointments)
✅ Plug it into your homepage exactly like that design
*/
