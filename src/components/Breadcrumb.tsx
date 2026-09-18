import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="مسیر صفحه"
      className="container"
      style={{
        padding: "16px 20px",
        fontSize: "14px",
        color: "#666",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={index}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={{
                  color: "#0066cc",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  color: isLast ? "#1a1a1a" : "#666",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span style={{ color: "#ccc", fontSize: "12px" }}>›</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}