"use client";

import { Company, Job } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/preview";
import { JobsTabContent } from "./jobs-tab-content";

interface TabContentSectionProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

export const TabContentSection = ({
  userId,
  company,
  jobs,
}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            ภาพรวม
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            ทำไมถึงควรเข้าร่วมกับเรา
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            งาน
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {company.overview ? <Preview value={company.overview} /> : ""}
        </TabsContent>
        <TabsContent value="joinus">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs} /> : ""}
        </TabsContent>
        <TabsContent value="jobs">
          <JobsTabContent userId={userId} jobs={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
