"use client";
import { useEffect, useState } from "react";
import Column from "./columns";
import { JobType } from "@/types/types";

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs/`);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className='w-full h-screen bg-linear-to-br from-background via-muted/10 to-background p-4 md:p-6'>
      {/* Header Section */}
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-primary'>
              Job Applications
            </h1>
            <p className='text-muted-foreground mt-1'>
              Track and manage your job applications
            </p>
          </div>
          <div className='bg-card border border-border rounded-lg px-4 py-2 shadow-sm'>
            <p className='text-sm text-muted-foreground'>Total Applications</p>
            <p className='text-2xl font-bold text-foreground'>{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]'>
        <Column
          title='REJECTED'
          column='Rejected'
          color='#d13d1f'
          allJobs={jobs}
          fetchAllJobs={fetchJobs}
        />
        <Column
          title='APPLIED'
          column='Applied'
          color='#9CA3AF'
          allJobs={jobs}
          fetchAllJobs={fetchJobs}
        />
        <Column
          title='INTERVIEWING'
          column='Interview'
          color='#FACC15'
          allJobs={jobs}
          fetchAllJobs={fetchJobs}
        />
        <Column
          title='OFFER RECEIVED'
          column='Offer'
          color='#38BDF8'
          allJobs={jobs}
          fetchAllJobs={fetchJobs}
        />
        <Column
          title='HIRED'
          column='Hired'
          color='#34D399'
          allJobs={jobs}
          fetchAllJobs={fetchJobs}
        />
      </div>
    </div>
  );
}
