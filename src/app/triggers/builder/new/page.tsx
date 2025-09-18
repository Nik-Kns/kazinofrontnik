"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function NewScenarioRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const template = searchParams.get("template");
    if (template) {
      router.replace(`/triggers/builder/new-scenario?template=${template}`);
    } else {
      router.replace(`/triggers/builder/new-scenario`);
    }
  }, [searchParams, router]);
  
  return null;
}

// Оборачиваем в Suspense для useSearchParams
export default function NewScenarioPage() {
  return (
    <Suspense fallback={null}>
      <NewScenarioRedirect />
    </Suspense>
  );
}