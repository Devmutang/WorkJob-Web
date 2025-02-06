import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { db } from "@/lib/db";
import { EmailForm } from "./_components/email-form";
import { ContactForm } from "./_components/contact-form";
import { ResumeForm } from "./_components/resume-form";
import { DataTable } from "@/components/ui/data-table";
import { AppliedJobsColumns, columns } from "./_components/column";
import { format } from "date-fns";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { truncate } from "lodash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { th } from "date-fns/locale"; // นำเข้า locale ภาษาไทย


const ProfilePage = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  let profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredAppliedJobs =
    profile && profile?.appliedJobs.length > 0
      ? jobs
          .filter((job) =>
            profile.appliedJobs.some(
              (appliedJob) => appliedJob.jobId === job.id
            )
          )
          .map((job) => ({
            ...job,
            appliedAt: profile.appliedJobs.find(
              (appliedJob) => appliedJob.jobId === job.id
            )?.appliedAt,
          }))
      : [];

  // ในส่วนของการฟอร์แมตวันที่
const formattedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map(
  (job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : "",
    category: job.category ? job.category?.name : "",
    appliedAt: job.appliedAt
      ? format(new Date(job.appliedAt), "d MMMM yyyy", { locale: th }) // ฟอร์แมตวันที่เป็นภาษาไทย
      : "",
  })
);

  const followedCompanies = await db.company.findMany({
    where: {
      followers: {
        has: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      <Box>
        <CustomBreadCrumb breadCrumbPage="โปรไฟล์ของฉัน" />
      </Box>

      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative overflow-hidden">
            <Image
              fill
              className="w-full h-full object-cover"
              alt="รูปโปรไฟล์ผู้ใช้"
              src={user.imageUrl}
            />
          </div>
        )}

        <NameForm initialData={profile} userId={userId} />
        <EmailForm initialData={profile} userId={userId} />
        <ContactForm initialData={profile} userId={userId} />

        <ResumeForm initialData={profile} userId={userId} />
      </Box>

      {/* ตารางรายการงานที่สมัคร */}

      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          งานที่สมัครแล้ว
        </h2>

        <div className="w-full mt-6">
          <DataTable
            columns={columns}
            searchKey="company"
            data={formattedJobs}
          />
        </div>
      </Box>

      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          บริษัทที่ติดตาม
        </h2>

        <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
          {followedCompanies.length === 0 ? (
            <p>ยังไม่ได้ติดตามบริษัทใด</p>
          ) : (
            <React.Fragment>
              {followedCompanies.map((com) => (
                <Card className="p-3 space-y-2 relative" key={com.id}>
                  <div className="w-full flex items-center justify-end">
                    <Link href={`/companies/${com.id}`}>
                      <Button variant={"ghost"} size={"icon"}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {com.logo && (
                    <div className="w-full h-24 flex items-center justify-center relative overflow-hidden">
                      <Image
                        fill
                        alt="โลโก้บริษัท"
                        src={com.logo}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}

                  <CardTitle className="text-lg">{com?.name}</CardTitle>
                  {com.description && (
                    <CardDescription>
                      {truncate(com?.description, {
                        length: 80,
                        omission: "...",
                      })}
                    </CardDescription>
                  )}
                </Card>
              ))}
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
