import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id Is Missing", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const userIndex = job.savedUsers.indexOf(userId);
    let updatedJob;
    if (userIndex !== -1) {
      // update the job
      updatedJob = await db.job.update({
        where: {
          id: jobId,
          userId,
        },
        data: {
          savedUsers: {
            set: job.savedUsers.filter((savedUserId) => savedUserId !== userId),
          },
        },
      });
    }

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_PUBLISH_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
