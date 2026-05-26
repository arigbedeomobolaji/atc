/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  FilePlus,
  User,
  Trash2,
  Shield,
} from "lucide-react";
import { useSortableList } from "@/hooks/useSortableList";

/* ── Single sortable row ── */
function LeaderRow({
  item,
  isDragging,
  onDelete,
}: {
  item: any;
  isDragging?: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: item._id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150 ${
        isDragging
          ? "opacity-40"
          : isOver
          ? "border-[hsl(45,68%,47%)]/50 bg-[hsl(45,68%,47%)]/5"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors shrink-0 touch-none"
        title="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Order badge */}
      <div className="w-7 h-7 rounded-lg bg-[hsl(220,64%,16%)]/8 flex items-center justify-center shrink-0">
        <span className="text-[hsl(220,64%,16%)] text-[10px] font-black">
          {String((item.order ?? 0) + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Photo */}
      {item.image ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[hsl(220,64%,16%)]/10 border border-[hsl(220,64%,16%)]/15 flex items-center justify-center shrink-0">
          <User size={16} className="text-[hsl(220,64%,16%)]/50" />
        </div>
      )}

      {/* Leader info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">
          {item.rank} {item.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-black text-[hsl(220,64%,16%)] uppercase tracking-wider bg-[hsl(220,64%,16%)]/8 px-2 py-0.5 rounded">
            {item.appointmentAbbreviation || item.appointment}
          </span>
          {item.appointment && item.appointmentAbbreviation && (
            <span className="text-[10px] text-slate-400 truncate">
              {item.appointment}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href={`/admin/command-leadership/${item._id}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-xs font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
        >
          <Pencil size={11} />
          <span className="hidden sm:inline">Edit</span>
        </Link>
        <button
          onClick={() => onDelete(item._id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs font-semibold hover:bg-red-50 hover:border-red-200 transition-colors"
          title="Delete leader"
        >
          <Trash2 size={11} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

/* ── Overlay card shown while dragging ── */
function DragCard({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 border-[hsl(45,68%,47%)] bg-white shadow-2xl opacity-95 rotate-1">
      <div className="p-1.5 rounded-lg text-[hsl(45,68%,47%)]">
        <GripVertical size={18} />
      </div>
      {item.image ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[hsl(220,64%,16%)]/10 border border-[hsl(220,64%,16%)]/15 flex items-center justify-center shrink-0">
          <User size={16} className="text-[hsl(220,64%,16%)]/50" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">
          {item.rank} {item.name}
        </p>
        <span className="text-[10px] font-black text-[hsl(220,64%,16%)] uppercase tracking-wider bg-[hsl(220,64%,16%)]/8 px-2 py-0.5 rounded">
          {item.appointmentAbbreviation || item.appointment}
        </span>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function CommandLeadershipAdminPage() {
  const { items, loading, sensors, activeId, activeItem, handleDragStart, handleDragEnd, handleDelete } =
    useSortableList({
      fetchUrl: "/api/command-leadership",
      reorderUrl: "/api/command-leadership/reorder",
      deleteUrl: (id) => `/api/command-leadership/${id}`,
      deleteConfirmMessage: "Delete this officer? This cannot be undone.",
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            HQ ATC Leadership
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Drag rows to set display order · changes save instantly
          </p>
        </div>
        <Link
          href="/admin/command-leadership/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
        >
          <FilePlus size={15} />
          Add Leader
        </Link>
      </div>

      {/* Drag hint */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(220,64%,16%)]/[0.04] border border-[hsl(220,64%,16%)]/10 text-slate-500 text-xs">
        <GripVertical size={14} className="text-slate-400 shrink-0" />
        <span>
          Drag the <span className="font-semibold text-slate-600">≡</span> handle on any row to reorder officers. Order saves automatically.
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center border border-slate-200 rounded-xl">
          <Shield size={36} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No leadership entries yet.</p>
          <Link
            href="/admin/command-leadership/create"
            className="mt-3 inline-flex items-center gap-2 text-sm text-[hsl(220,64%,16%)] hover:underline"
          >
            <FilePlus size={14} /> Add your first officer
          </Link>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item) => (
                <LeaderRow
                  key={item._id}
                  item={item}
                  isDragging={item._id === activeId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem ? <DragCard item={activeItem} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
