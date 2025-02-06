"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
  initialData: Job; // ข้อมูลงานเริ่มต้น
  jobId: string; // ไอดีของงานที่ต้องการอัปเดต
  options: { label: string; value: string }[]; // ตัวเลือกของหมวดหมู่
}

const formSchema = z.object({
  categoryId: z.string().min(1), // categoryId ต้องมีค่าเป็น string ที่มีความยาวอย่างน้อย 1 ตัวอักษร
});

export const CategoryForm = ({
  initialData,
  jobId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // สถานะสำหรับกำหนดว่าอยู่ในโหมดแก้ไขหรือไม่
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "", // ค่าเริ่มต้น categoryId
    },
  });

  const { isSubmitting, isValid } = form.formState; // สถานะฟอร์ม เช่น กำลังส่งหรือไม่

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values); // อัปเดตงานในฐานข้อมูล
      toast.success("งานได้รับการอัพเดต"); // แจ้งเตือนเมื่อสำเร็จ
      toggleEditing();
      router.refresh(); // รีเฟรชหน้าเว็บ
    } catch (error) {
      toast.error("มีบางอย่างผิดพลาด"); // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current); // สลับโหมดแก้ไข

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId // หาหมวดหมู่ที่เลือกไว้ในปัจจุบัน
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
      หมวดหมู่งาน {/* หัวข้อ Job Category */}
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>ยกเลิก</> // แสดงปุ่ม Cancel หากอยู่ในโหมดแก้ไข
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
             แก้ไข {/* แสดงปุ่ม Edit หากไม่ได้อยู่ในโหมดแก้ไข */}
            </>
          )}
        </Button>
      </div>

      {/* แสดง categoryId หากไม่ได้อยู่ในโหมดแก้ไข */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.categoryId && "text-neutral-500 italic" // หากไม่มี categoryId ให้แสดงเป็นข้อความ italic
          )}
        >
          {selectedOption?.label || "ไม่มีหมวดหมู่งาน"} {/* แสดงชื่อหมวดหมู่ */}
        </p>
      )}

      {/* แสดงฟอร์มเมื่ออยู่ในโหมดแก้ไข */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)} // เมื่อส่งฟอร์มจะเรียก onSubmit
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options} // ส่งตัวเลือกหมวดหมู่ไปยัง Combobox
                      heading="Categories"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* แสดงข้อความแจ้งเตือนกรณีเกิดข้อผิดพลาด */}
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
               บันทึก{/* ปุ่ม Save */}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
