"use client";

import { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

export default function Organogram() {
  const nodes: Node[] = [
    {
      id: "1",
      position: { x: 500, y: 0 },
      data: { label: "AIR OFFICER COMMANDING (AOC)" },
    },
    {
      id: "2",
      position: { x: 750, y: 100 },
      data: { label: "CHIEF OF STAFF (COS)" },
    },
    {
      id: "3",
      position: { x: 600, y: 150 },
      data: { label: "PRINCIPAL STAFF OFFICERS (PSOs)" },
    },

    {
      id: "4",
      position: { x: 300, y: 100 },
      data: { label: "AIR ASSISTANT (AA)" },
    },
    {
      id: "5",
      position: { x: 500, y: 250 },
      data: { label: "UNITS" },
    },
    {
      id: "6",
      position: { x: 20, y: 400 },
      data: { label: "401 Flying Training School, Kaduna" },
    },
    {
      id: "7",
      position: { x: 20, y: 500 },
      data: { label: "Air Traffic Services Training Centre" },
    },
    {
      id: "8",
      position: { x: 20, y: 600 },
      data: { label: "413 FPG, Kaduna" },
    },
    {
      id: "9",
      position: { x: 200, y: 400 },
      data: { label: "431 Engineering Group" },
    },
    {
      id: "10",
      position: { x: 200, y: 500 },
      data: { label: "441 Communications Group" },
    },
    {
      id: "11",
      position: { x: 200, y: 600 },
      data: { label: "453 Base Services Group" },
    },
    {
      id: "12",
      position: { x: 400, y: 400 },
      data: { label: "461 NAF Hospital" },
    },
    {
      id: "13",
      position: { x: 400, y: 500 },
      data: { label: "Central Avionics Overhaul & Calibration Centre" },
    },
    {
      id: "14",
      position: { x: 400, y: 600 },
      data: { label: "Air Force Comprehensive School, Kaduna" },
    },
    {
      id: "15",
      position: { x: 600, y: 400 },
      data: { label: "403 Flying Training School, Kano" },
    },
    {
      id: "16",
      position: { x: 600, y: 500 },
      data: { label: "455 Base Services Group, Kano" },
    },
    {
      id: "17",
      position: { x: 600, y: 600 },
      data: { label: "465 NAF Hospital, Kano" },
    },
    {
      id: "18",
      position: { x: 200, y: 400 },
      data: { label: "ATSTC, Kaduna" },
    },
    {
      id: "19",
      position: { x: 800, y: 400 },
      data: { label: "Air Force Comprehensive School, Kano" },
    },
    {
      id: "20",
      position: { x: 800, y: 500 },
      data: { label: "405 Helicopter Combat Training Group, Enugu" },
    },
    {
      id: "21",
      position: { x: 800, y: 600 },
      data: { label: "409 International Helicopter Flying School, Enugu" },
    },
    {
      id: "22",
      position: { x: 1000, y: 400 },
      data: { label: "410 Central Flying School, Katsina" },
    },
    {
      id: "23",
      position: { x: 1000, y: 500 },
      data: { label: "407 Air Combat Training Group, Kainji" },
    },
    {
      id: "24",
      position: { x: 1000, y: 600 },
      data: { label: "NAF School of Air Intelligence, Makurdi" },
    },
    {
      id: "25",
      position: { x: 1200, y: 400 },
      data: { label: "Air Force Girls Comprehensive School, Abuja" },
    },
    {
      id: "26",
      position: { x: 1200, y: 500 },
      data: { label: "NAF Institute of Safety, Ipetu-Ijesha" },
    },
  ];

  const edges: Edge[] = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
    { id: "e1-4", source: "1", target: "4" },
    { id: "e1-5", source: "1", target: "5" },
    { id: "e5-6", source: "5", target: "6" },
    { id: "e5-7", source: "5", target: "7" },
    { id: "e5-8", source: "5", target: "8" },
    { id: "e5-9", source: "5", target: "9" },
    { id: "e5-10", source: "5", target: "10" },
    { id: "e5-11", source: "5", target: "11" },
    { id: "e5-12", source: "5", target: "12" },
    { id: "e5-13", source: "5", target: "9" },
    { id: "e5-14", source: "5", target: "14" },
    { id: "e5-15", source: "5", target: "15" },
    { id: "e5-16", source: "5", target: "16" },
    { id: "e5-17", source: "5", target: "17" },
    { id: "e5-18", source: "5", target: "18" },
    { id: "e5-19", source: "5", target: "19" },
    { id: "e5-20", source: "5", target: "20" },
    { id: "e5-21", source: "5", target: "21" },
    { id: "e5-22", source: "5", target: "22" },
    { id: "e5-23", source: "5", target: "23" },
    { id: "e5-24", source: "5", target: "24" },
    { id: "e5-25", source: "5", target: "25" },
    { id: "e5-26", source: "5", target: "26" },
  ];

  return (
    <div className="w-full h-[350px] md:h-[600px]">
      <ReactFlowProvider>
        <FlowWrapper nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
}

function FlowWrapper({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Give ReactFlow a small delay to mount before fitting
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
  }, [fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
