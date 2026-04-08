"use client";

import { Suspense } from "react";
import CreateCommanderContent from "./CreateCommanderContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCommanderContent />
    </Suspense>
  );
}
