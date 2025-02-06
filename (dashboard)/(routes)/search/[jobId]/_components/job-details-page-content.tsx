"use client";

import { Banner } from "@/components/banner";
import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Preview } from "@/components/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { Button } from "@/components/ui/button";
import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

export const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onApplied = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/users/${userProfile?.userId}/appliedJobs`,
        jobId
      );

      // ส่งอีเมลขอบคุณให้ผู้ใช้
      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: userProfile?.email,
      });

      toast.success("สมัครงานสำเร็จ");
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("มีบางอย่างผิดพลาด...");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <React.Fragment>
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />

      {userProfile &&
        userProfile?.appliedJobs?.some(
          (appliedJob) => appliedJob.jobId === jobId
        ) && (
          <Banner
            variant={"success"}
            label="ขอบคุณที่สมัครงาน! เราได้รับใบสมัครของคุณแล้วและกำลังพิจารณาอย่างละเอียด เราจะติดต่อกลับไปเร็วๆ นี้"
          />
        )}

      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "ค้นหา", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>

      {/* รูปภาพปกของงาน */}
      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              alt={job.title}
              fill
              className="object-cover w-full h-full"
              src={job?.imageUrl}
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">
                {job?.title}
              </h2>
            </div>
          )}
        </div>
      </Box>

      {/* ชื่อและปุ่มการกระทำ */}

      <Box className=" mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job?.title}
          </h2>

          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo && (
                <Image
                  alt={job?.company?.name}
                  width={25}
                  height={25}
                  src={job?.company?.logo}
                />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        {/* ปุ่มการกระทำ */}
        <div>
          {userProfile ? (
            <React.Fragment>
              {!userProfile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId
              ) ? (
                <Button
                  className="text-sm bg-purple-700 hover:bg-purple-900 hover:shadow-sm"
                  onClick={() => setOpen(true)}
                >
                  สมัครงาน
                </Button>
              ) : (
                <Button
                  className="text-sm text-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white hover:shadow-sm"
                  variant={"outline"}
                >
                  สมัครแล้ว
                </Button>
              )}
            </React.Fragment>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 bg-purple-700 hover:bg-purple-900 hover:shadow-sm">
                อัปเดตโปรไฟล์
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* คำอธิบาย */}
      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">คำอธิบาย :</h2>
        <p className="font-sans">{job?.short_description}</p>
      </Box>

      {job?.description && (
        <Box>
          <Preview value={job?.description} />
        </Box>
      )}

      {job?.attachments && job?.attachments.length > 0 && (
        <Box className="flex-col my-4 items-start justify-start px-4 font-sans">
          <h2 className="text-lg font-semibold">ไฟล์แนบ :</h2>
          <p>ดาวน์โหลดไฟล์แนบเพื่อดูรายละเอียดเพิ่มเติมเกี่ยวกับงาน</p>
          {job?.attachments.map((item) => (
            <div key={item.id} className="space-y-3">
              <Link
                href={item.url}
                target="_blank"
                download
                className="flex items-center gap-1 text-purple-500"
              >
                <FileIcon className="w-4 h-4 mr-2" />
                <p>{item.name}</p>
              </Link>
            </div>
          ))}
        </Box>
      )}
    </React.Fragment>
  );
};
