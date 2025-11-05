"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import JobModal from "./jobmodal";
import JobDropdown from "./jobdropdown";
import { JobType } from "@/types/types";
import { Briefcase, MapPin, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

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

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <>
      <motion.div
        layout
        layoutId={cardInfo._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div
          draggable={true}
          onDragStart={(e: React.DragEvent) => handleDragStart(e, cardInfo)}
          className='group cursor-grab rounded-sm border bg-card active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-foreground/20'
          style={{
            borderLeft: `3px solid ${colourScheme}`,
          }}
        >
          {/* Header Section */}
          <div className='flex items-start justify-between p-3 pb-2'>
            <div
              className='flex-1 cursor-pointer'
              onClick={() => setOpenTask(true)}
            >
              <div className='flex items-center gap-2 mb-1'>
                <p className='text-sm font-semibold text-foreground truncate'>
                  {cardInfo.companyName}
                </p>
                {cardInfo.priority && (
                  <span
                    className='px-1.5 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wide'
                    style={{
                      backgroundColor: `${getPriorityColor(
                        cardInfo.priority
                      )}15`,
                      color: getPriorityColor(cardInfo.priority),
                      border: `1px solid ${getPriorityColor(
                        cardInfo.priority
                      )}30`,
                    }}
                  >
                    {cardInfo.priority}
                  </span>
                )}
              </div>
              <div className='flex items-center gap-1.5 text-muted-foreground mb-2'>
                <Briefcase className='w-3.5 h-3.5' strokeWidth={2} />
                <p className='text-xs truncate'>{cardInfo.role}</p>
              </div>
            </div>
            <JobDropdown card={cardInfo} deleteJob={deleteJob} />
          </div>

          {/* Details Section */}
          <div
            className='px-3 pb-3 space-y-1.5 cursor-pointer'
            onClick={() => setOpenTask(true)}
          >
            {cardInfo.location && (
              <div className='flex items-center gap-1.5 text-muted-foreground/80'>
                <MapPin className='w-3 h-3' strokeWidth={2} />
                <p className='text-[11px] truncate'>{cardInfo.location}</p>
              </div>
            )}

            {cardInfo.salaryRange && (
              <div className='flex items-center gap-1.5 text-muted-foreground/80'>
                <DollarSign className='w-3 h-3' strokeWidth={2} />
                <p className='text-[11px] truncate'>{cardInfo.salaryRange}</p>
              </div>
            )}

            {cardInfo.dateApplied && (
              <div className='flex items-center gap-1.5 text-muted-foreground/80'>
                <Calendar className='w-3 h-3' strokeWidth={2} />
                <p className='text-[11px]'>
                  {format(new Date(cardInfo.dateApplied), "MMM dd, yyyy")}
                </p>
              </div>
            )}
          </div>

          {/* Notes Preview */}
          {cardInfo.notes && (
            <div
              className='px-3 pb-3 pt-2 border-t border-border/50 cursor-pointer'
              onClick={() => setOpenTask(true)}
            >
              <p className='text-[11px] text-muted-foreground/70 line-clamp-2 italic'>
                {cardInfo.notes}
              </p>
            </div>
          )}
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
