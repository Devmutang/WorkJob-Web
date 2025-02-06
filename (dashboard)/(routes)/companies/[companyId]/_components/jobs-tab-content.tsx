"use client";

import { Job } from "@prisma/client";
import { PageContent } from "../../../search/_components/page-content";

interface JobsTabContentProps {
  jobs: Job[];
  userId: string | null;
}

export const JobsTabContent = ({ jobs, userId }: JobsTabContentProps) => {
  return <PageContent jobs={jobs} userId={userId} />;
};
