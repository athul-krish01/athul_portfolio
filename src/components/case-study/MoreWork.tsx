import Image from "next/image";
import { projects } from "@/data/projects";
import { cn } from "@/lib/cn";

/** The other Selected work projects, so a reader can keep going. */
export function MoreWork({ currentId, className }: { currentId: string; className?: string }) {
  const others = projects.filter((p) => p.id !== currentId && !p.comingSoon);

  return (
    <section aria-labelledby="more-work" className={cn("flex flex-col gap-8", className)}>
      <h2 id="more-work" className="text-section-heading text-ink">
        More work
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((project) => {
          const external = project.href.startsWith("http");
          return (
            <li key={project.id}>
              <a
                href={project.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex h-full flex-col gap-4 rounded-card outline-none focus-visible:ring-2 focus-visible:ring-nav-mark/30 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                <span className="relative block aspect-[450/306] overflow-hidden rounded-card border border-stroke bg-card-backplate">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 980px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                    unoptimized
                  />
                </span>
                <span className="text-[18px] font-medium leading-6 tracking-[-0.02em] text-ink group-hover:underline group-hover:underline-offset-4">
                  {project.title}
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
