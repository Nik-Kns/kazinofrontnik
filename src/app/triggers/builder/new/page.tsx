"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Просто перенаправляем на основную страницу builder с правильным ID
export default function NewScenarioPage() {
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