"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import JobModal from "./jobmodal";
import JobDropdown from "./jobdropdown";
import { JobType } from "@/types/types";

interface Props {
  cardInfo: JobType;
  handleDragStart: (e: React.DragEvent, card: JobType) => void;
  colourScheme: string;
  deleteJob: (id: string) => Promise<void>;
}

export default function Card({
  cardInfo,
  handleDragStart,
  colourScheme,
  deleteJob,
}: Props) {
  const [openTask, setOpenTask] = useState<boolean>(false);

  return (
    <>
      <motion.div layout layoutId={cardInfo._id} className='mb-2'>
        <div
          draggable={true}
          onDragStart={(e: React.DragEvent) => handleDragStart(e, cardInfo)}
          className='cursor-grab rounded border-2 active:cursor-grabbing flex items-center justify-between w-full p-3 transition-colors bg-card border-l-4'
          style={{ borderLeftColor: colourScheme }}
        >
          <div
            className='flex-1 cursor-pointer'
            onClick={() => setOpenTask(true)}
          >
            <p className='text-base font-semibold text-foreground truncate'>
              {cardInfo.companyName}
            </p>
            <p className='text-sm text-muted-foreground truncate'>
              {cardInfo.role}
            </p>
          </div>
          <JobDropdown card={cardInfo} deleteJob={deleteJob} />
        </div>
      </motion.div>

      {/* Modal for viewing job details */}
      {openTask && (
        <JobModal
          modalType='view'
          card={cardInfo}
          column={cardInfo.status}
          onClose={() => setOpenTask(false)}
        />
      )}
    </>
  );
}
