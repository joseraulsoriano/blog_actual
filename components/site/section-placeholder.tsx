import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SectionPlaceholder({
  title,
  description,
  fase,
}: {
  title: string;
  description: string;
  fase: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="flex flex-col items-start gap-4">
        <Badge variant="outline">
          <Construction className="h-3 w-3" /> En construcción · {fase}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-xl text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
