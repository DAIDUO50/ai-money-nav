"use client";

import { useEffect } from "react";
import { recordPageView } from "@/lib/browsing-history";

interface RecordViewProps {
  siteKey: string;
}

export default function RecordView({ siteKey }: RecordViewProps) {
  useEffect(() => {
    recordPageView();
  }, [siteKey]);

  return null;
}