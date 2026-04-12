"use client";

import type { PaginationState, Updater } from "@tanstack/react-table";
import { Clock, Pencil, Trash2, UserCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { analyzeCall, getCallData } from "@/actions/retell";
import { getFeedbackByInterviewIdAndEmail } from "@/actions/feedback";
import { updateInterview } from "@/actions/interviews";
import { getResponseByCallIdAction, updateResponse } from "@/actions/responses";
import type { BreadcrumbOptions } from "@/components/ui/app-breadcrumbs";
import AppBreadcrumbs from "@/components/ui/app-breadcrumbs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { PAGE_SIZE } from "@/lib/constants";
import { convertSecondstoMMSS } from "@/lib/utils";
import type { Interview } from "@/types/database.types";
import type { Interviewer } from "@/types/interviewer";
import type { InterviewDetailTableResponse } from "@/types/database.types";
import type { Analytics, CallData, FeedbackData } from "@/types/response";
import CandidateResponseDialog from "../candidate-response";
import CreateInterviewDialog from "../create/create-interview-dialog";
import DeleteInterviewDialog from "./delete-interview-dialog";
import InterviewDetailSearch from "./interview-detail-search";
import StatusCard from "./status-card";
import { useInterviewDetailColumns } from "./use-interview-detail-columns";

interface Stats {
  avgDuration: number;
  completionRate: number;
  sentimentCount: { positive: number; negative: number; neutral: number };
  candidateStatusCount: Record<string, number>;
}

interface InterviewDetailsClientsProps {
  interview: Interview;
  data: InterviewDetailTableResponse[];
  stats: Stats;
  interviewers: Interviewer[];
  totalCount: number;
  statsTotal: number;
}

type ResponseDialogState = {
  isOpen: boolean;
  isLoading: boolean;
  callId: string | null;
  callData: CallData | null;
  analytics: Analytics | null;
  response: InterviewDetailTableResponse | null;
  feedback: FeedbackData | null;
};

const closedDialog: ResponseDialogState = {
  isOpen: false,
  isLoading: false,
  callId: null,
  callData: null,
  analytics: null,
  response: null,
  feedback: null,
};

export default function InterviewDetailClient(props: InterviewDetailsClientsProps) {
  const { interview, data, stats, interviewers, totalCount, statsTotal } = props;
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(interview.isActive ?? true);
  const [analyzingCallId, setAnalyzingCallId] = useState<string | null>(null);
  const [responseDialog, setResponseDialog] = useState<ResponseDialogState>(closedDialog);
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("ALL").withOptions({ shallow: false }),
  );
  const [, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex: page ?? 0, pageSize: PAGE_SIZE }),
    [page],
  );

  const setPagination = (updater: Updater<PaginationState>) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setPage(next.pageIndex);
  };

  const breadcrumbs = useMemo<BreadcrumbOptions[]>(
    () => [{ href: "/", label: "Interviews" }, { label: interview.name ?? "" }],
    [interview.name],
  );

  const handleToggle = async () => {
    const updatedIsActive = !isActive;
    setIsActive(updatedIsActive);
    const result = await updateInterview(interview.id, { isActive: updatedIsActive });
    if (result.success) {
      toast.success("Interview status updated", {
        description: `The interview is now ${updatedIsActive ? "active" : "inactive"}.`,
        position: "bottom-right",
        duration: 3000,
      });
      router.refresh();
    } else {
      setIsActive(!updatedIsActive);
      toast.error("Error", {
        description: "Failed to update the interview status.",
        duration: 3000,
      });
    }
  };

  const handleAnalyzeResponse = async (response: InterviewDetailTableResponse) => {
    setAnalyzingCallId(response.callId);
    try {
      await analyzeCall(response.callId ?? "");
      router.refresh();
    } catch {
      toast.error("Failed to analyze response.");
    } finally {
      setAnalyzingCallId(null);
    }
  };

  const handleViewResponse = async (response: InterviewDetailTableResponse) => {
    setResponseDialog({
      isOpen: true,
      isLoading: true,
      callId: response.callId,
      callData: null,
      analytics: null,
      response: null,
      feedback: null,
    });

    if (!response.isViewed) {
      void updateResponse({ isViewed: true }, response.callId ?? "").then(() => router.refresh());
    }

    const [callResult, respData, feedbackResult] = await Promise.all([
      getCallData(response.callId ?? ""),
      getResponseByCallIdAction(response.callId ?? ""),
      getFeedbackByInterviewIdAndEmail(interview.id, response.email ?? ""),
    ]);

    setResponseDialog((s) => ({
      ...s,
      isLoading: false,
      callData: callResult.success ? (callResult.data?.callResponse ?? null) : null,
      analytics: callResult.success ? (callResult.data?.analytics ?? null) : null,
      response: respData,
      feedback: feedbackResult ?? null,
    }));
  };

  const handleFilterChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(0);
  };

  const handleSearch = () => {
    setSearch(searchValue);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearch(null);
    setStatus(null);
    setPage(null);
  };

  const columns = useInterviewDetailColumns({
    analyzingCallId,
    handleViewResponse,
    handleAnalyzeResponse,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <AppBreadcrumbs items={breadcrumbs} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{isActive ? "Active" : "Inactive"}</span>
            <Switch
              checked={isActive}
              className={`${isActive ? "bg-primary" : "bg-input"}`}
              onCheckedChange={handleToggle}
            />
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setEditOpen(true)}
            title="Edit interview"
            className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <span>Edit</span>
            <Pencil className="text-primary" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setDeleteOpen(true)}
            title="Delete interview"
            className="border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <span>Delete</span>
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatusCard
          value={statsTotal}
          icon={<Users size={20} className="text-primary" />}
          label="Total Candidates"
        />
        <StatusCard
          value={convertSecondstoMMSS(stats.avgDuration)}
          icon={<Clock size={20} className="text-primary" />}
          label="Average Duration"
        />
        <StatusCard
          value={`${Math.round(stats.completionRate * 100) / 100}%`}
          icon={<UserCheck size={20} className="text-primary" />}
          label="Interview Completion Rate"
        />
      </div>

      <div className="flex w-full flex-col gap-2 pb-4">
        <InterviewDetailSearch
          filterStatus={status ?? "ALL"}
          onFilterStatusChange={handleFilterChange}
          searchValue={searchValue}
          onSearchValueChange={(val) => {
            setSearchValue(val);
            if (!val) handleClearSearch();
          }}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />
        <DataTable
          columns={columns}
          data={data}
          emptyMessage="No responses to display"
          pagination={pagination}
          setPagination={setPagination}
          rowCount={totalCount}
          manualPagination={true}
        />
      </div>

      {responseDialog.isOpen && (
        <CandidateResponseDialog
          open={responseDialog.isOpen}
          onClose={() => setResponseDialog((s) => ({ ...s, isOpen: false }))}
          isLoading={responseDialog.isLoading}
          callId={responseDialog.callId ?? ""}
          callData={responseDialog.callData}
          analytics={responseDialog.analytics}
          responseData={responseDialog.response}
          interviewId={interview.id}
          feedbackData={responseDialog.feedback}
        />
      )}

      {deleteOpen && (
        <DeleteInterviewDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          interviewId={interview.id}
          interviewName={interview.name ?? ""}
          onDeleted={() => router.push("/")}
        />
      )}

      {editOpen && (
        <CreateInterviewDialog
          open={editOpen}
          setOpen={setEditOpen}
          interviewers={interviewers}
          mode="edit"
          initialData={{
            id: interview.id,
            name: interview.name ?? "",
            objective: interview.objective ?? "",
            description: interview.description ?? "",
            questions: interview.questions ?? [],
            questionCount: interview.questionCount ?? 0,
            timeDuration: interview.timeDuration ?? "",
            interviewerId: interview.interviewerId ?? "",
          }}
        />
      )}
    </div>
  );
}
