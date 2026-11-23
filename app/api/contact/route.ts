import { site } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      name: site.name,
      role: site.role,
      email: site.email,
      linkedin: site.linkedin,
      github: site.github,
      resume: site.resume,
      location: "Los Angeles, CA · remote",
      status: "open_to_work",
      looking_for: ["Data Analyst", "BI Analyst", "AI Engineer", "AI Solutions Specialist"],
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
