import { JobStatus, Priority } from "@/lib/constants";

export interface JobType {
  _id: string;
  userId: string;
  companyName: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  salaryRange?: string;
  location?: string;
  priority: Priority;
  notes?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

// export interface UserType {
//   _id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   isVerified: string;
// }
export interface SearchQuery {
  userId: string;
  status?: JobStatus;
  priority?: Priority;
}

export interface NewJob {
  userId: string;
  companyName: string;
  role: string;
  priority: Priority;
  dateApplied: Date;
  status?: JobStatus;
  salaryRange?: string;
  location?: string;
  link?: string;
  notes?: string;
}