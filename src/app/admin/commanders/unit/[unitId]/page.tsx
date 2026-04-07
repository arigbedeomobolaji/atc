/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UnitCommandersPage() {
  const { unitId } = useParams();

  const [data, setData] = useState<any[]>([]);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [cmdRes, unitRes] = await Promise.all([
        fetch(`/api/commanders/history/${unitId}`),
        fetch(`/api/units/${unitId}`),
      ]);

      const cmds = await cmdRes.json();
      const unitData = await unitRes.json();

      setData(cmds);
      setUnit(unitData);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (unitId) load();
  }, [unitId]);

  async function deleteCommander(id: string) {
    if (!confirm("Delete this commander?")) return;

    try {
      const res = await fetch(`/api/commanders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        load(); // refresh
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  const current = data.find((c) => !c.endDate);
  const past = data.filter((c) => c.endDate);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1a365d]">
          {unit?.unit} Commanders
        </h1>

        <div className="flex gap-2">
          <Link
            href={`/admin/commanders/create?unitId=${unitId}`}
            className="bg-[#1a365d] text-white px-4 py-2 rounded-lg"
          >
            + Current
          </Link>

          <Link
            href={`/admin/commanders/create?unitId=${unitId}&type=past`}
            className="bg-[#c9a227] text-white px-4 py-2 rounded-lg"
          >
            + Past
          </Link>
        </div>
      </div>

      {/* CURRENT */}
      <section>
        <h2 className="font-semibold mb-3">Current Commander</h2>

        {current ? (
          <div className="bg-blue-50 border-l-4 border-[#1a365d] p-4 rounded-lg flex justify-between">
            <div>
              <p className="font-semibold">
                {current.rank} {current.name}
              </p>
            </div>

            <div className="flex gap-3 text-sm">
              <Link href={`/admin/commanders/${current._id}`}>View</Link>
              <Link
                href={`/admin/commanders/${current._id}/edit`}
                className="text-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteCommander(current._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p>No current commander</p>
        )}
      </section>

      {/* PAST */}
      <section>
        <h2 className="font-semibold mb-3">Past Commanders</h2>

        <div className="space-y-3">
          {past.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between"
            >
              <div>
                <p>
                  {c.rank} {c.name}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <Link href={`/admin/commanders/${c._id}`}>View</Link>
                <Link
                  href={`/admin/commanders/${c._id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteCommander(c._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// export default function UnitCommandersPage() {
//   const { unitId } = useParams();

//   const [data, setData] = useState<any[]>([]);
//   const [unit, setUnit] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     try {
//       const [cmdRes, unitRes] = await Promise.all([
//         fetch(`/api/commanders/history/${unitId}`),
//         fetch(`/api/units/${unitId}`),
//       ]);

//       const cmds = await cmdRes.json();
//       const unitData = await unitRes.json();

//       setData(cmds);
//       setUnit(unitData);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (unitId) load();
//   }, [unitId]);

//   async function deleteCommander(id: string) {
//     if (!confirm("Delete this commander?")) return;

//     try {
//       const res = await fetch(`/api/commanders/${id}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         load(); // refresh
//       } else {
//         alert("Delete failed");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   if (loading) return <div className="p-6">Loading...</div>;

//   const current = data.find((c) => !c.endDate);
//   const past = data.filter((c) => c.endDate);

//   return (
//     <div className="p-6 space-y-8">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-bold">{unit?.unit} Commanders</h1>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex gap-4">
//         <Link
//           href={`/admin/commanders/create?unitId=${unitId}`}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg"
//         >
//           + Add Current Commander
//         </Link>

//         <Link
//           href={`/admin/commanders/create?unitId=${unitId}&type=past`}
//           className="bg-gray-700 text-white px-4 py-2 rounded-lg"
//         >
//           + Add Past Commander
//         </Link>
//       </div>

//       {/* CURRENT COMMANDER */}
//       <div>
//         <h2 className="font-semibold text-lg mb-2">Current Commander</h2>

//         {current ? (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex justify-between">
//             <div>
//               <p className="font-semibold">
//                 {current.rank} {current.name}
//               </p>
//               <p className="text-sm text-gray-500">
//                 Since {new Date(current.startDate).toLocaleDateString()}
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <Link
//                 href={`/admin/commanders/${current._id}`}
//                 className="text-gray-600"
//               >
//                 View
//               </Link>
//               <Link
//                 href={`/admin/commanders/${current._id}/edit`}
//                 className="text-blue-600"
//               >
//                 Edit
//               </Link>
//               <button
//                 onClick={() => deleteCommander(current._id)}
//                 className="text-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-400">No current commander</p>
//         )}
//       </div>

//       {/* PAST COMMANDERS */}
//       <div>
//         <h2 className="font-semibold text-lg mb-2">Past Commanders</h2>

//         {past.length === 0 && <p className="text-gray-400">No history yet</p>}

//         <div className="space-y-3">
//           {past.map((c) => (
//             <div
//               key={c._id}
//               className="bg-white shadow rounded-lg p-4 flex justify-between"
//             >
//               <div>
//                 <p className="font-medium">
//                   {c.rank} {c.name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(c.startDate).toLocaleDateString()} →{" "}
//                   {new Date(c.endDate).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <Link
//                   href={`/admin/commanders/${c._id}`}
//                   className="text-gray-600"
//                 >
//                   View
//                 </Link>
//                 <Link
//                   href={`/admin/commanders/${c._id}/edit`}
//                   className="text-blue-600"
//                 >
//                   Edit
//                 </Link>
//                 <button
//                   onClick={() => deleteCommander(c._id)}
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
