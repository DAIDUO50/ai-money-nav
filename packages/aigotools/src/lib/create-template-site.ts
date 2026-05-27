import { ProcessStage, SiteState } from "./constants";

import { Site } from "@/models/site";

export const createTemplateSite = (site: Partial<Site> = {}) => {
  const newSite: Omit<Site, "_id"> = {
    userId: "",
    url: "",
    siteKey: "",
    featured: false,
    weight: 0,
    name: "",
    icon: "",
    subCategory: "",
    snapshot: "",
    description: "",
    pricingType: "",
    categories: [],
    images: [],
    features: [],
    usecases: [],
    users: [],
    relatedSearches: [],
    pricings: [],
    links: {},
    voteCount: 0,
    rating: 4.0,
    metaKeywords: [],
    metaDescription: "",
    searchSuggestWords: [],
    state: SiteState.unpublished,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    processStage: ProcessStage.pending,
  };

  return { ...newSite, ...site } as Site;
};
