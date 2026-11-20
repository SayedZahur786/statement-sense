import { Workspace } from "@/components/workspace";
export default function Page() {
  return <Workspace uploadsAvailable={!!process.env.DATABASE_URL} />;
}
