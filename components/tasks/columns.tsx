"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import DropIndicator from "./dropIndicator";
import Card from "./card";
import JobModal from "./jobmodal";
import { JobType } from "@/types/types";

interface ColumnProps {
  title: string;
  color: string;
  column: string;
  allJobs: JobType[];
  fetchAllJobs: () => Promise<void>;
}

export default function Column({
  title,
  color,
  column,
  allJobs,
  fetchAllJobs,
}: ColumnProps) {
  const [active, setActive] = useState(false);
  const [adding, setAdding] = useState(false);

  const updateJob = async (id: string, updatedData: Partial<JobType>) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAllJobs();
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchAllJobs();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, card: JobType) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("cardId", card._id);
    e.dataTransfer.setData("sourceColumn", card.status);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Only set inactive if actually leaving the drop zone
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);

    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    console.log("Drop event:", { cardId, sourceColumn, targetColumn: column });

    // Don't update if dropped in the same column
    if (!cardId || sourceColumn === column) {
      console.log("Same column or no card ID, skipping update");
      return;
    }

    console.log("Updating job status to:", column);
    const updatedData = { status: column };
    updateJob(cardId, updatedData as JobType);
  };

  const filteredCards = allJobs.filter((job) => job.status === column);

  return (
    <div className='w-full shrink-0'>
      <div className='mb-4 flex items-center justify-between bg-linear-to-r from-muted/80 to-muted/40 rounded-lg px-4 py-3 border border-border/50 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div
            className='w-1 h-6 rounded-full shadow-md'
            style={{ backgroundColor: color }}
          />
          <h3 className='font-semibold text-base' style={{ color }}>
            {title}
          </h3>
        </div>
        <span
          className='rounded-full px-3 py-1 text-sm font-medium shadow-sm'
          style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}40`,
          }}
        >
          {filteredCards.length}
        </span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-[500px] rounded-xl p-3 transition-all duration-300 space-y-2.5 ${
          active
            ? "bg-linear-to-br from-muted/60 to-muted/30 border-2 border-dashed shadow-inner scale-[1.02]"
            : "bg-muted/20 border border-transparent"
        }`}
        style={{
          borderColor: active ? `${color}60` : "transparent",
        }}
      >
        {filteredCards.map((card) => (
          <Card
            key={card._id}
            cardInfo={card}
            handleDragStart={handleDragStart}
            colourScheme={color}
            deleteJob={deleteJob}
          />
        ))}

        <DropIndicator column={column} beforeId={null} />

        {adding ? (
          <JobModal
            modalType='add'
            card={null}
            column={column}
            onClose={() => {
              setAdding(false);
              fetchAllJobs();
            }}
          />
        ) : (
          <motion.button
            layout
            onClick={() => setAdding(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-dashed hover:shadow-md mt-2'
            style={{
              borderColor: `${color}40`,
              color: color,
              backgroundColor: `${color}10`,
            }}
          >
            <Plus className='w-4 h-4' />
            <span>Add new card</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
