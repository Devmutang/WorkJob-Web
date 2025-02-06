"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("งานได้รับการอัปเดตแล้ว");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("มีบางอย่างผิดพลาด");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `สร้างอาร์เรย์ของคำสำคัญ 10 อันดับแรกที่เกี่ยวข้องกับอาชีพ '${prompt}' คำสำคัญเหล่านี้ควรครอบคลุมแง่มุมต่าง ๆ ของอาชีพ รวมถึงทักษะ ความรับผิดชอบ เครื่องมือ และเทคโนโลยีที่มักเกี่ยวข้องกับอาชีพดังกล่าว พยายามสร้างชุดคำสำคัญที่หลากหลายซึ่งสามารถแสดงถึงความกว้างของอาชีพนี้ได้อย่างถูกต้อง ผลลัพธ์ของคุณควรเป็นรายการหรืออาร์เรย์ของคำสำคัญเท่านั้น และส่งคืนเฉพาะอาร์เรย์ให้ฉันเท่านั้น`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        // check the data response is an array or not
        if (Array.isArray(JSON.parse(data))) {
          setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
        }
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("มีบางอย่างผิดพลาด...");
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };

  return (
    <div className="">
      {/* display the tags if not editing */}
      {!isEditing && (
        <div className="flex items-center flex-wrap gap-2">

        </div>
      )}

      {/* on editing mode display the input */}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="ตัวอย่าง: 'นักพัฒนา Full-Stack'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w4 h-4 " />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
          หมายเหตุ: ชื่ออาชีพเพียงอย่างเดียวก็เพียงพอที่จะสร้างแท็กได้
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>

          <div className=" flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            >
              ล้างทั้งหมด
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
            >
              บันทึก
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
