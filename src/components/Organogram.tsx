"use client";

import { useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

/* ── Custom node: top-level command (gold accent) ── */
function CommandNode({ data }: NodeProps) {
  return (
    <div className="relative px-5 py-3 rounded-xl shadow-xl border border-[hsl(45,68%,47%)]/60 bg-[hsl(220,64%,16%)] min-w-[180px] text-center">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-[hsl(45,68%,47%)]" />
      <p className="text-[hsl(45,68%,47%)] text-[10px] font-black uppercase tracking-[0.2em] leading-tight">
        {data.label}
      </p>
      <Handle type="target" position={Position.Top} className="!bg-[hsl(45,68%,47%)] !border-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-[hsl(45,68%,47%)] !border-0 !w-2 !h-2" />
    </div>
  );
}

/* ── Custom node: staff role (crimson accent) ── */
function StaffNode({ data }: NodeProps) {
  return (
    <div className="relative px-4 py-2.5 rounded-xl shadow-lg border border-[hsl(350,66%,33%)]/50 bg-[hsl(220,64%,22%)] min-w-[160px] text-center">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-[hsl(350,66%,33%)]" />
      <p className="text-white text-[10px] font-bold uppercase tracking-wider leading-tight">
        {data.label}
      </p>
      <Handle type="target" position={Position.Top} className="!bg-[hsl(350,66%,33%)] !border-0 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-[hsl(350,66%,33%)] !border-0 !w-2 !h-2" />
    </div>
  );
}

/* ── Custom node: unit (white/glass) ── */
function UnitNode({ data }: NodeProps) {
  return (
    <div className="relative px-3 py-2 rounded-lg shadow-md border border-white/15 bg-[hsl(220,64%,26%)] min-w-[140px] max-w-[200px] text-center">
      <p className="text-white/85 text-[9px] font-semibold leading-tight">
        {data.label}
      </p>
      <Handle type="target" position={Position.Top} className="!bg-white/40 !border-0 !w-1.5 !h-1.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/40 !border-0 !w-1.5 !h-1.5" />
    </div>
  );
}

const nodeTypes = {
  command: CommandNode,
  staff: StaffNode,
  unit: UnitNode,
};

const NODES: Node[] = [
  // Top command
  { id: "1",  type: "command", position: { x: 480, y: 0 },   data: { label: "Air Officer Commanding (AOC)" } },
  // Immediate staff
  { id: "2",  type: "staff",   position: { x: 760, y: 110 }, data: { label: "Chief of Staff (COS)" } },
  { id: "3",  type: "staff",   position: { x: 490, y: 110 }, data: { label: "Principal Staff Officers (PSOs)" } },
  { id: "4",  type: "staff",   position: { x: 220, y: 110 }, data: { label: "Air Assistant (AA)" } },
  // Units hub
  { id: "5",  type: "command", position: { x: 480, y: 230 }, data: { label: "UNITS" } },
  // Units — Kaduna cluster
  { id: "6",  type: "unit",    position: { x: 0,   y: 370 }, data: { label: "401 FTS, Kaduna" } },
  { id: "7",  type: "unit",    position: { x: 0,   y: 440 }, data: { label: "Air Traffic Services Training Centre" } },
  { id: "8",  type: "unit",    position: { x: 0,   y: 510 }, data: { label: "413 FPG, Kaduna" } },
  { id: "9",  type: "unit",    position: { x: 0,   y: 580 }, data: { label: "431 Engineering Group" } },
  { id: "10", type: "unit",    position: { x: 0,   y: 650 }, data: { label: "441 Communications Group" } },
  { id: "11", type: "unit",    position: { x: 0,   y: 720 }, data: { label: "453 Base Services Group" } },
  { id: "12", type: "unit",    position: { x: 0,   y: 790 }, data: { label: "461 NAF Hospital, Kaduna" } },
  { id: "13", type: "unit",    position: { x: 0,   y: 860 }, data: { label: "Central Avionics Overhaul Centre" } },
  { id: "14", type: "unit",    position: { x: 0,   y: 930 }, data: { label: "AF Comprehensive School, Kaduna" } },
  // Units — Kano cluster
  { id: "15", type: "unit",    position: { x: 240, y: 370 }, data: { label: "403 FTS, Kano" } },
  { id: "16", type: "unit",    position: { x: 240, y: 440 }, data: { label: "455 Base Services Group, Kano" } },
  { id: "17", type: "unit",    position: { x: 240, y: 510 }, data: { label: "465 NAF Hospital, Kano" } },
  { id: "18", type: "unit",    position: { x: 240, y: 580 }, data: { label: "ATSTC, Kaduna" } },
  { id: "19", type: "unit",    position: { x: 240, y: 650 }, data: { label: "AF Comprehensive School, Kano" } },
  // Units — Enugu / South cluster
  { id: "20", type: "unit",    position: { x: 480, y: 370 }, data: { label: "405 Helicopter Combat Training Group, Enugu" } },
  { id: "21", type: "unit",    position: { x: 480, y: 440 }, data: { label: "409 International Helicopter Flying School, Enugu" } },
  { id: "22", type: "unit",    position: { x: 480, y: 510 }, data: { label: "410 Central Flying School, Katsina" } },
  { id: "23", type: "unit",    position: { x: 480, y: 580 }, data: { label: "407 Air Combat Training Group, Kainji" } },
  // Units — Other locations
  { id: "24", type: "unit",    position: { x: 720, y: 370 }, data: { label: "NAF School of Air Intelligence, Makurdi" } },
  { id: "25", type: "unit",    position: { x: 720, y: 440 }, data: { label: "AF Girls Comprehensive School, Abuja" } },
  { id: "26", type: "unit",    position: { x: 720, y: 510 }, data: { label: "NAF Institute of Safety, Ipetu-Ijesha" } },
];

const UNIT_IDS = ["6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26"];

const EDGES: Edge[] = [
  // AOC → staff
  { id: "e1-2", source: "1", target: "2", style: { stroke: "hsl(350,66%,33%)", strokeWidth: 1.5 }, animated: false },
  { id: "e1-3", source: "1", target: "3", style: { stroke: "hsl(350,66%,33%)", strokeWidth: 1.5 } },
  { id: "e1-4", source: "1", target: "4", style: { stroke: "hsl(350,66%,33%)", strokeWidth: 1.5 } },
  // AOC → units hub
  { id: "e1-5", source: "1", target: "5", style: { stroke: "hsl(45,68%,47%)", strokeWidth: 2 }, animated: true },
  // Units hub → each unit
  ...UNIT_IDS.map((uid) => ({
    id: `e5-${uid}`,
    source: "5",
    target: uid,
    style: { stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 },
  })),
];

function FlowWrapper({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const { fitView } = useReactFlow();

  const onInit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.12, duration: 800 }), 120);
  }, [fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
      proOptions={{ hideAttribution: true }}
      style={{ background: "hsl(220,64%,10%)" }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1}
        color="rgba(255,255,255,0.06)"
      />
      <Controls
        style={{
          background: "hsl(220,64%,16%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
        }}
      />
    </ReactFlow>
  );
}

export default function Organogram() {
  return (
    <div className="w-full h-[600px] lg:h-[700px]">
      <ReactFlowProvider>
        <FlowWrapper nodes={NODES} edges={EDGES} />
      </ReactFlowProvider>
    </div>
  );
}
