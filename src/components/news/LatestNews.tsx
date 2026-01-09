/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { NewsGridWithContent } from "./NewsGridWithContent";

export default function LatestNews() {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 6;

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/news/list?page=${page}&limit=${limit}`);
      const j = await res.json();
      setRows(j.news || []);
      setTotalPages(j.totalPages || 0);
    }
    load();
  }, [page]);

  return (
    <>
      {!!totalPages ? (
        <div className="space-y-4 h-full my-3">
          {rows.map((item: any) => (
            <NewsGridWithContent key={item._id} item={item} size="small" />
          ))}

          {/* Pagination */}
          <div className="flex gap-2 mt-4 justify-center">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No news available.</p>
      )}
    </>
  );
}
