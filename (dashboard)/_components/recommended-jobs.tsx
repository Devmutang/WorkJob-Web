"use client";

import Box from "@/components/box";
import { Job } from "@prisma/client";
import { PageContent } from "../(routes)/search/_components/page-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecommendedJobsListProps {
  jobs: Job[];
  userId: string | null;
}

export const RecommendedJobsList = ({
  jobs,
  userId,
}: RecommendedJobsListProps) => {
  return (
    <Box className="flex-col justify-center gap-y-4 my-6 mt-12">
      <h2 className="text-2xl font-semibold tracking-wider font-sans">
        งานที่คุณอาจสนใจ
      </h2>

      <div className=" mt-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      <Link href={"/search"} className="my-8">
        <Button className="w-44 h-12 rounded-xl border border-purple-500 hover:bg-transparent hover:shadow-md text-purple-500 hover:text-purple-600 bg-transparent">
          บริษัททั้งหมด
        </Button>
      </Link>
    </Box>
  );
};
