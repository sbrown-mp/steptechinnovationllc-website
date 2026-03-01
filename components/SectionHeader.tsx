import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 space-y-4", center && "text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{title}</h2>
      {description ? (
        <p className={cn("max-w-3xl text-base text-slate-300 md:text-lg", center && "mx-auto")}>{description}</p>
      ) : null}
    </header>
  );
}
