import { BarChart3, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: UserCheck,
    title: "Custom AI interviewers",
    description:
      "Pick from built-in interviewer personas with different tones. The candidate gets a consistent experience every time.",
  },
  {
    icon: Users,
    title: "Candidate pipeline",
    description:
      "See every candidate's status at a glance and move them through your pipeline from the dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity monitoring",
    description:
      "Flags tab switches mid-interview so you can factor engagement into your decision.",
  },
  {
    icon: BarChart3,
    title: "Interview analytics",
    description:
      "Track completion rates, average duration, and sentiment trends across all your interviews.",
  },
];

export default function MarketingFeatures() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          What&apos;s included
        </p>
        <h2 className="mb-12 font-extrabold text-3xl tracking-tight sm:text-4xl">
          Everything you need to run the whole process.
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-all hover:-translate-y-1 hover:shadow-lg"
              size="sm"
            >
              <CardContent>
                <f.icon size={20} className="mb-3 text-primary" />
                <h3 className="mb-1 font-semibold text-base">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
