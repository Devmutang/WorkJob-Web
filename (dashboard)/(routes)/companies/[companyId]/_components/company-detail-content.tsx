"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Company, Job } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { TabContentSection } from "./tab-content-section";

interface CompanyDetailContentPageProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

export const CompanyDetailContentPage = ({
  userId,
  company,
  jobs,
}: CompanyDetailContentPageProps) => {
  const isFollower = userId && company?.followers?.includes(userId);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClickAddRemoveFollower = async () => {
    try {
      setIsLoading(true);
      if (isFollower) {
        await axios.patch(`/api/companies/${company?.id}/removeFollower`);
        toast.success("ยกเลิกติดตามแล้ว");
      } else {
        await axios.patch(`/api/companies/${company?.id}/addFollower`);
        toast.success("ติดตามแล้ว");
      }
      router.refresh();
    } catch (error) {
      console.log("Error : ", error);
      toast.error((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full rounded-2xl bg-white p-4 z-50 -mt-8">
      <div className="flex-col w-full px-4">
        {/* company details */}

        <div className="w-full flex items-center justify-between -mt-12">
          <div className="flex items-end justify-end space-x-4">
            {company?.logo && (
              <div className="aspect-square w-auto bg-white h-32 rounded-2xl border flex items-center justify-center relative overflow-hidden p-3">
                <Image
                  width={120}
                  height={120}
                  alt={company?.name}
                  src={company?.logo}
                  className="object-contain"
                />
              </div>
            )}

            {/* name contents etc... */}
            <div className="flex-col space-y-1">
              <div className=" flex items-center gap-2">
                <h2 className="text-xl font-sans font-bold text-neutral-700 capitalize">
                  {company?.name}
                </h2>
                <p className="text-muted-foreground text-sm">{`(${company?.followers?.length}) ผู้ติดตาม`}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                Leveraging Technology to Provide Better Services
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">
                  Mangement Consulting
                </p>
                <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">
                  IT Servies & Consulting
                </p>
                <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">
                  Private
                </p>
                <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">
                  Corporate
                </p>
                <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">
                  B2B
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onClickAddRemoveFollower}
            className={cn(
              "w-24 rounded-full hover:shadow-md flex items-center justify-center border border-purple-500",
              !isFollower && "bg-purple-600 hover:bg-purple-700"
            )}
            variant={isFollower ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <React.Fragment>
                {isFollower ? (
                  "ยกเลิกติดตาม"
                ) : (
                  <React.Fragment>
                    <Plus className="w-4 h-4 mr-2" /> ติดตาม
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Button>
        </div>

        {/* tab content */}
        <TabContentSection userId={userId} jobs={jobs} company={company} />
      </div>
    </div>
  );
};
