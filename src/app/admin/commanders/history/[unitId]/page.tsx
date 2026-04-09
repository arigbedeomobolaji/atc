/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CommanderHistoryPage() {
  const { unitId } = useParams();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/commanders/history/${unitId}`)
      .then((res) => res.json())
      .then(setData);
  }, [unitId]);

  return (
    <div className="p-6">
      <h4 className="text-2xl font-bold mb-6">Commander History</h4>

      <div className="space-y-4">
        {data.map((c) => (
          <div
            key={c._id}
            className="bg-card text-card-foreground border border-border shadow-sm rounded-lg p-4 hover:shadow-md transition"
          >
            <p className="font-semibold text-primary">
              {c.rank} {c.name}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              {new Date(c.startDate).toLocaleDateString()} →{" "}
              {c.endDate ? new Date(c.endDate).toLocaleDateString() : "Present"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
