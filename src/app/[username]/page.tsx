import { notFound } from "next/navigation";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { SponsorBanner } from "@/components/sponsor-banner";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  if (isReservedSlug(username)) {
    notFound();
  }

  // TODO: fetch profile from API — for now, mock as free plan
  const plan = "free" as const;

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex flex-1 items-center justify-center">
        <p className="text-lg text-muted-foreground">
          <span className="font-bold text-foreground">{username}</span>의 프로필
          페이지 (준비 중)
        </p>
      </main>

      <SponsorBanner plan={plan} />
    </div>
  );
}
