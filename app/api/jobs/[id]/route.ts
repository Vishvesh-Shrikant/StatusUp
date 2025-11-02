import { NextResponse } from "next/server";
import Job from "@/models/jobs";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const job = await Job.findById(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Ensure the user owns this job
  if (job.userId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  Object.assign(job, {
    ...body,
    updatedAt: new Date(),
  });

  await job.save();

  return NextResponse.json({
    success: true,
    message: "Job updated successfully",
    job,
  });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await Job.findById(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.userId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  await Job.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Job deleted successfully",
  });
}
