"use client";

import { AttachmentsUploads } from "@/components/attachments-uploads";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile, Resumes } from "@prisma/client";
import axios from "axios";
import {
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { uploadToCloudinary } from "@/config/lib/cloudinary"; // ✅ เปลี่ยนจาก Google Drive เป็น Cloudinary

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.object({ url: z.string(), name: z.string(), type: z.string(), size: z.number() }).array(),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const initialResumes = initialData?.resumes?.map((resume) => ({
    url: resume.url,
    name: resume.name,
    type: "application/pdf", // ✅ กำหนดค่าเริ่มต้น
    size: 0, 
  })) || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  return (
    <div >
          {/* <div className="font-medium flex items-center justify-between">
            เรซูเม่ของคุณ
            <Button onClick={() => setIsEditing(!isEditing)} variant={"ghost"}>
              {isEditing ? <>ยกเลิก</> : <><PlusCircle className="w-4 h-4 mr-2" /> เพิ่มไฟล์</>}
            </Button>
          </div> */}

      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div className="grid grid-cols-12 gap-2" key={item.id}>
              <div className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center col-span-10">
                <p className="text-xs w-full truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (values) => {
            console.log(values, userId);
            try {
              await axios.post(`/api/users/${userId}/resumes`, values);
              toast.success("Resume updated");
              setIsEditing(false);
              router.refresh();
            } catch (error) {
              console.log((error as Error)?.message);
              toast.error("Something went wrong");
            }
          })} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={async (resumes) => {
                        if (resumes && resumes.length > 0) {
                          const file = resumes[0];

                          if (file instanceof File) {
                            try {
                              const fileUrl = await uploadToCloudinary(file);
                              field.onChange([
                                { url: fileUrl, name: file.name, type: file.type, size: file.size },
                              ]);
                              toast.success("อัปโหลดไฟล์สำเร็จ!");
                            } catch (error) {
                              console.error("Upload failed:", error);
                              toast.error("อัปโหลดไฟล์ล้มเหลว กรุณาลองใหม่");
                            }
                          } else {
                            toast.error("กรุณาเลือกไฟล์ที่ถูกต้อง");
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">บันทึก</Button>
          </form>
        </Form>
      )}
    </div>
  );
};
