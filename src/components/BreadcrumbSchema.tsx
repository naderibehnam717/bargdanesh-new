interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export default function BreadcrumbSchema({
  items,
  baseUrl = "https://www.bargdanesh.ir",
}: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && {
        item: item.href.startsWith("http")
          ? item.href
          : `${baseUrl}${item.href}`,
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}