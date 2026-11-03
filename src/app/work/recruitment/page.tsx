import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { hirebit } from "@/data/case-studies/hirebit";

export const metadata: Metadata = {
  title: `${hirebit.product}: ${hirebit.title} — Athul Krishna`,
  description: hirebit.intro,
};

export default function RecruitmentCaseStudy() {
  return (
    <CaseStudyShell>
      <CaseStudy />
    </CaseStudyShell>
  );
}
