// // app/admin/dashboard/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [auth, setAuth] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     async function check() {
//       const res = await fetch("/api/auth/me");
//       const json = await res.json();
//       setAuth(json.authenticated);
//       setLoading(false);
//       if (!json.authenticated) router.push("/admin/login");
//     }
//     check();
//   }, [router]);

//   if (loading) return <div className="p-10">Loading...</div>;

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
//       <div className="grid gap-4">
//         <Link href="/admin/news/create" className="p-4 bg-white rounded shadow">
//           Create News
//         </Link>
//         <Link href="/admin/news" className="p-4 bg-white rounded shadow">
//           Manage News
//         </Link>
//       </div>
//     </div>
//   );
// }

// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setLoading(false);
      if (!json.authenticated) router.push("/admin/login");
    }
    check();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/news/create" className="p-4 bg-white rounded shadow">
          Create News
        </Link>
        <Link href="/admin/news" className="p-4 bg-white rounded shadow">
          Manage News
        </Link>
      </div>
    </div>
  );
}
