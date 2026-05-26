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
  ExternalLink,
  FilePlus,
  Building2,
  MapPin,
  Trash2,
} from "lucide-react";
import { useSortableList } from "@/hooks/useSortableList";

/* ── Single sortable row ── */
function UnitRow({
  unit,
  isDragging,
  onDelete,
}: {
  unit: any;
  isDragging?: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: unit._id });

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
          {String(unit.order + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Logo */}
      {unit.logo ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
          <Image
            src={unit.logo}
            alt={unit.abbreviation}
            fill
            className="object-contain p-1"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[hsl(220,64%,16%)]/10 border border-[hsl(220,64%,16%)]/15 flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-[hsl(220,64%,16%)]/50" />
        </div>
      )}

      {/* Unit info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{unit.unit}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-black text-[hsl(220,64%,16%)] uppercase tracking-wider bg-[hsl(220,64%,16%)]/8 px-2 py-0.5 rounded">
            {unit.abbreviation}
          </span>
          {unit.location && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
              <MapPin size={9} />
              {unit.location}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href={`/admin/units/${unit._id}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-xs font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
        >
          <Pencil size={11} />
          <span className="hidden sm:inline">Edit</span>
        </Link>
        <Link
          href={`/units/${unit.slug}`}
          target="_blank"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          <ExternalLink size={11} />
          <span className="hidden sm:inline">View</span>
        </Link>
        <button
          onClick={() => onDelete(unit._id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs font-semibold hover:bg-red-50 hover:border-red-200 transition-colors"
          title="Delete unit"
        >
          <Trash2 size={11} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

/* ── Overlay card shown while dragging ── */
function DragCard({ unit }: { unit: any }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 border-[hsl(45,68%,47%)] bg-white shadow-2xl opacity-95 rotate-1">
      <div className="p-1.5 rounded-lg text-[hsl(45,68%,47%)]">
        <GripVertical size={18} />
      </div>
      {unit.logo ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
          <Image
            src={unit.logo}
            alt={unit.abbreviation}
            fill
            className="object-contain p-1"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[hsl(220,64%,16%)]/10 border border-[hsl(220,64%,16%)]/15 flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-[hsl(220,64%,16%)]/50" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{unit.unit}</p>
        <span className="text-[10px] font-black text-[hsl(220,64%,16%)] uppercase tracking-wider bg-[hsl(220,64%,16%)]/8 px-2 py-0.5 rounded">
          {unit.abbreviation}
        </span>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function UnitsAdminPage() {
  const { items: units, loading, sensors, activeId, activeItem, handleDragStart, handleDragEnd, handleDelete } =
    useSortableList({
      fetchUrl: "/api/units",
      reorderUrl: "/api/units/reorder",
      deleteUrl: (id) => `/api/units/${id}`,
      deleteConfirmMessage: "Delete this unit? This cannot be undone.",
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            Units
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Drag rows to set display order · changes save instantly
          </p>
        </div>
        <Link
          href="/admin/units/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
        >
          <FilePlus size={15} />
          Create Unit
        </Link>
      </div>

      {/* Drag hint */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(220,64%,16%)]/[0.04] border border-[hsl(220,64%,16%)]/10 text-slate-500 text-xs">
        <GripVertical size={14} className="text-slate-400 shrink-0" />
        <span>
          Drag the <span className="font-semibold text-slate-600">≡</span> handle on any row to reorder units. Order saves automatically.
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : units.length === 0 ? (
        <div className="py-16 text-center border border-slate-200 rounded-xl">
          <Building2 size={36} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No units yet.</p>
          <Link
            href="/admin/units/create"
            className="mt-3 inline-flex items-center gap-2 text-sm text-[hsl(220,64%,16%)] hover:underline"
          >
            <FilePlus size={14} /> Create your first unit
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
            items={units.map((u) => u._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {units.map((unit) => (
                <UnitRow
                  key={unit._id}
                  unit={unit}
                  isDragging={unit._id === activeId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem ? <DragCard unit={activeItem} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
