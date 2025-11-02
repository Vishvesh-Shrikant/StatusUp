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
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='font-medium' style={{ color }}>
          {title}
        </h3>
        <span className='rounded text-sm text-neutral-400'>
          {filteredCards.length}
        </span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors space-y-1 ${
          active ? "bg-neutral-200/50" : "bg-neutral-800/0"
        }`}
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
            className='flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs text-foreground dark:text-foreground hover:text-neutral-700 dark:hover:text-neutral-50'
          >
            <span>Add card</span>
            <Plus />
          </motion.button>
        )}
      </div>
    </div>
  );
}
