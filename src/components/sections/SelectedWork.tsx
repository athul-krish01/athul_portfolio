import { projects } from "@/data/projects";
import { WorkCard } from "@/components/ui/WorkCard";
import { cn } from "@/lib/cn";

/**
 * The 2x2 work grid, two columns on desktop and one below 768px (approved
 * decision). Figma fakes the shared border by giving each card partial
 * borders and a single rounded corner, which caused measurable 1px drift
 * between cards in the source file. This uses one bordered/rounded
 * container with internal 1px dividers instead — same visual result,
 * without the drift risk (approved decision).
 */
export function SelectedWork({ className }: { className?: string }) {
  const lastRowStart = projects.length - (projects.length % 2 === 0 ? 2 : 1);

  return (
    // gap-8 = the 32px between the "Selected work" heading and the grid;
    // lg:px-10 is the 40px content inset inside the 980px column, which
    // gives the grid its 900px width (2 x 450px cards).
    <section
      id="selected-work"
      className={cn("flex flex-col gap-8 lg:px-10", className)}
    >
      <h2 className="text-section-heading text-ink">Selected work</h2>

      <div className="grid grid-cols-1 overflow-hidden rounded-card border border-stroke md:grid-cols-2">
        {projects.map((project, index) => {
          const isLastMobile = index === projects.length - 1;
          const isLastDesktopRow = index >= lastRowStart;
          const isLeftColumn = index % 2 === 0;

          return (
            <div
              key={project.id}
              className={cn(
                "border-stroke",
                !isLastMobile && "border-b",
                isLastDesktopRow && "md:border-b-0",
                isLeftColumn && "md:border-r",
              )}
            >
              <WorkCard project={project} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
