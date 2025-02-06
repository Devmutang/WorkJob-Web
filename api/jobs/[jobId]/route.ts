import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId } = params;

    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID Is missing", { status: 401 });
    }

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// delete the job id

export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID Is missing", { status: 401 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return new NextResponse("Job Not found", { status: 404 });
    }

    if (job.imageUrl) {
      // delete from the firebase storage
      const storageRef = ref(storage, job.imageUrl);
      await deleteObject(storageRef);
    }

    if (Array.isArray(job.attachments) && job.attachments.length > 0) {
      // iterate over each attachment file url
      await Promise.all(
        job.attachments.map(async (attachment: Attachment) => {
          const attachmentStorageRef = ref(storage, attachment.url);
          await deleteObject(attachmentStorageRef);
        })
      );
    }

    // delete the attachments records from the mongodb
    await db.attachment.deleteMany({
      where: {
        jobId,
      },
    });

    const deleteJob = await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(deleteJob);
  } catch (error) {
    console.log(`[JOB_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
