import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CandidateStatusDropdown from "./candidate-status-dropdown";
import { DeleteResponseDialog } from "./delete-response-dialog";

interface CandidateHeaderProps {
  call_id: string;
  name: string;
  email: string;
  candidateStatus: string;
  recordingUrl?: string | null;
  tabSwitchCount?: number;
  isDeleting: boolean;
  onDeleteClick: () => void;
}

export function CandidateHeader(props: CandidateHeaderProps) {
  const {
    call_id,
    name,
    email,
    candidateStatus,
    recordingUrl,
    tabSwitchCount,
    isDeleting,
    onDeleteClick,
  } = props;
  return (
    <div className="min-h-30 rounded-xl bg-muted p-4">
      <div className="flex w-full flex-col justify-between gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <Avatar>
              <AvatarFallback className="bg-primary text-background">
                {name ? name[0].toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {name && <p className="px-2 font-semibold text-sm">{name}</p>}
              {email && <p className="px-2 text-sm">{email}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tabSwitchCount && tabSwitchCount > 0 ? (
              <Badge
                variant="outline"
                className="rounded-md border-orange-300 bg-orange-50 py-2.5 text-orange-600"
              >
                Tab Switching Detected
              </Badge>
            ) : null}

            {/* Status + Delete always stay together */}
            <div className="flex items-center gap-2">
              <CandidateStatusDropdown call_id={call_id} initialStatus={candidateStatus} />
              <DeleteResponseDialog isDeleting={isDeleting} onConfirm={onDeleteClick} />
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <p className="font-semibold">Interview Recording</p>
          <div className="flex flex-wrap items-center gap-3">
            {recordingUrl ? (
              // biome-ignore lint/a11y/useMediaCaption: false
              <audio src={recordingUrl} controls />
            ) : (
              <p className="text-muted-foreground text-sm">No recording available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
