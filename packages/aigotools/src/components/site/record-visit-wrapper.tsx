"use client";

import { Site } from "@/models/site";
import RecordView from "./record-visit";

interface RecordViewWrapperProps {
  site: Site;
}

export default function RecordViewWrapper({ site }: RecordViewWrapperProps) {
  return <RecordView siteKey={site.siteKey} />;
}