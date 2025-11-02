import { NextResponse } from "next/server";
import Job from "@/models/jobs";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JobStatus, Priority } from "@/lib/constants";
import { NewJob, SearchQuery } from "@/types/types";

export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const query: SearchQuery = { userId: session.user.id };
  if (status) query.status = status as JobStatus;
  if (priority) query.priority = priority as Priority;

  const jobs = await Job.find(query).sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    message: "Jobs fetched successfully",
    jobs,
  });
}

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    companyName,
    role,
    dateApplied,
    status,
    salaryRange,
    location,
    priority,
    notes,
    link,
  } = body;

  if (!companyName || !role || !priority) {
    return NextResponse.json(
      {
        success: false,
        error: "Company name , role and priority are required",
      },
      { status: 400 }
    );
  }
  const newJob: NewJob = {
    userId: session.user.id,
    companyName,
    role,
    priority,
    dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
  };
  if (status) newJob.status = status;
  if (salaryRange) newJob.salaryRange = salaryRange;
  if (location) newJob.location = location;
  if (link) newJob.link = link;
  if (notes) newJob.notes = notes;

  const job = new Job({
    userId: session.user.id,
    companyName,
    role,
    dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
    status,
    salaryRange,
    location,
    priority,
    notes,
    link,
  });

  await job.save();

  return NextResponse.json({
    success: true,
    message: "Job created successfully",
    job,
  });
}
