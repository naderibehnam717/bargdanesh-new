import type { MetadataRoute } from "next";
import { getAllFiles } from "@/lib/files";
import { getFilePath } from "@/lib/filePath";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.bargdanesh.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ────────── 1. صفحات ایستاتیک ──────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/notes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/university`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/school`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/konkur`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/employment`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/chemistry`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/physics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/computer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/psychology`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/sociology`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/english`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/islamic`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/education`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // ────────── 2. صفحات داینامیک (فایل‌ها) ──────────
  const allFiles = await getAllFiles();
  const filePages: MetadataRoute.Sitemap = allFiles.map((file) => ({
    url: `${BASE_URL}${getFilePath(file)}`,
    lastModified: now,
    changeFrequency: file.type === "منابع غیر درسی" ? "monthly" : "weekly",
    priority: file.level === "دانشگاهی" ? 0.8 : 0.6,
  }));

  // ────────── 3. صفحات داینامیک (کنکور) ──────────
  let konkurPages: MetadataRoute.Sitemap = [];
  try {
    const konkurList = await prisma.konkur.findMany({
      select: { slug: true, updatedAt: true },
    });

    konkurPages = konkurList.map((k) => ({
      url: `${BASE_URL}/konkur/${k.slug}`,
      lastModified: k.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap konkur error:", error);
  }

  return [...staticPages, ...filePages, ...konkurPages];
}