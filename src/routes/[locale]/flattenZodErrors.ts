import type { z } from "@builder.io/qwik-city";
export default function flattenZodIssues(issues: z.ZodIssue | z.ZodIssue[]) {
  issues = Array.isArray(issues) ? issues : [issues];

  return issues.reduce(
    (acc, issue) => {
      acc[issue.path.join(".")] = issue.message;
      return acc;
    },
    {} as Record<string, string>
  );
}
