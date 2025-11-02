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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 w-full h-full gap-3 p-4'>
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
  );
}
