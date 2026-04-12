"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Interviewer } from "@/types/interviewer";
import CreateInterviewDialog from "../create/create-interview-dialog";

interface CreateInterviewCardProps {
  interviewers: Interviewer[];
}

function CreateInterviewCard({ interviewers }: CreateInterviewCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="flex h-64 shrink-0 cursor-pointer items-center overflow-hidden rounded-md border-2 border-border border-dashed shadow-none ring-0"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardContent className="mx-auto flex h-full flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="rounded-full bg-primary/10 p-2">
              <div className="rounded-full bg-primary p-1 text-background">
                <Plus size={24} />
              </div>
            </div>
          </div>
          <CardTitle className="pt-1.5 text-center text-md">Create an Interview</CardTitle>
        </CardContent>
      </Card>

      {open && (
        <CreateInterviewDialog
          mode="create"
          open={open}
          setOpen={setOpen}
          interviewers={interviewers}
        />
      )}
    </>
  );
}

export default CreateInterviewCard;
