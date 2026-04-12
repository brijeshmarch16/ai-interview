import { ScreenStatusCard } from "./screen-status-card";

export default function IneligibleScreen() {
  return (
    <ScreenStatusCard
      title="You have already responded in this interview or you are not eligible to respond. Thank you!"
      description="You can close this tab now."
    />
  );
}
