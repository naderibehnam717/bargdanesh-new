import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "آرشیو کنکور — دفترچه سوالات و کلید پاسخ",
  description:
    "دانلود رایگان دفترچه سوالات و کلید پاسخ کنکور سراسری سال‌های گذشته (۱۴۰۰ تا ۱۴۰۵) در تمامی رشته‌ها — ریاضی، تجربی، انسانی، هنر و زبان",
  keywords: [
    "آرشیو کنکور",
    "دفترچه سوالات کنکور",
    "کلید پاسخ کنکور",
    "دانلود کنکور",
    "کنکور ۱۴۰۵",
    "کنکور ۱۴۰۴",
    "کنکور ریاضی",
    "کنکور تجربی",
    "کنکور انسانی",
    "سوالات کنکور سراسری",
    "برگ دانش",
  ],
  alternates: {
    canonical: "https://www.bargdanesh.ir/konkur",
  },
  openGraph: {
    title: "آرشیو کنکور | برگ دانش",
    description:
      "دانلود رایگان دفترچه سوالات و کلید پاسخ کنکور سراسری تمامی رشته‌ها",
    url: "https://www.bargdanesh.ir/konkur",
    type: "website",
    locale: "fa_IR",
    siteName: "برگ دانش",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "آرشیو کنکور برگ دانش",
      },
    ],
  },
};

const FIELDS = [
  { value: "ریاضی و فنی", icon: "📐", color: "#0066cc" },
  { value: "علوم تجربی", icon: "🧬", color: "#10b981" },
  { value: "علوم انسانی", icon: "📚", color: "#7c3aed" },
  { value: "هنر", icon: "🎨", color: "#f59e0b" },
  { value: "زبان‌های خارجی", icon: "🌍", color: "#e11d48" },
];

const YEARS = [1405, 1404, 1403, 1402, 1401, 1400];

interface PageProps {
  searchParams: Promise<{ year?: string; field?: string }>;
}

export default async function KonkurPage({ searchParams }: PageProps) {
  const { year, field } = await searchParams;

  const where: { year?: number; field?: string } = {};
  if (year && year !== "all") {
    const y = parseInt(year);
    if (!isNaN(y)) where.year = y;
  }
  if (field && field !== "all") {
    where.field = field;
  }

  const konkurList = await prisma.konkur.findMany({
    where,
    orderBy: [
      { year: "desc" },
      { field: "asc" },
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });

  // ─── گروه‌بندی: سال → رشته ───
  const groupedData = konkurList.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = {};
    if (!acc[item.year][item.field]) acc[item.year][item.field] = [];
    acc[item.year][item.field].push(item);
    return acc;
  }, {} as Record<number, Record<string, typeof konkurList>>);

  const sortedYears = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a);

  const toFa = (n: number) =>
    String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

  return (
    <>
      <section className="page-header">
        <div className="container page-header__inner">
          <h1 className="page-header__title">📚 آرشیو کنکور</h1>
          <p className="page-header__subtitle">
            دفترچه سوالات و کلید پاسخ کنکور سراسری
          </p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {/* محتوای متنی سئو */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 40px",
              padding: "24px",
              background: "#f8f9fa",
              borderRadius: "16px",
              lineHeight: 2,
              textAlign: "justify",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              دانلود رایگان دفترچه سوالات کنکور سراسری
            </h2>
            <p style={{ marginBottom: "12px", color: "#444" }}>
              آرشیو کامل <strong>دفترچه سوالات و کلید پاسخ کنکور سراسری</strong>{" "}
              از سال ۱۴۰۰ تا ۱۴۰۵ در تمامی رشته‌ها (ریاضی و فنی، علوم تجربی،
              علوم انسانی، هنر و زبان‌های خارجی) به‌صورت رایگان در برگ دانش
              در دسترس شماست.
            </p>
            <p style={{ margin: 0, color: "#444" }}>
              استفاده از <strong>سوالات کنکور سال‌های گذشته</strong> یکی از
              مؤثرترین روش‌های آمادگی برای کنکور است. با حل این سوالات، با
              ساختار آزمون، نوع سوالات و سطح دشواری آن‌ها آشنا می‌شوید.
            </p>
          </div>

          {/* فیلترها */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* فیلتر سال */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#666",
                  marginBottom: "8px",
                }}
              >
                📅 سال کنکور:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link
                  href="/konkur"
                  className={`btn btn--sm ${
                    !year || year === "all" ? "btn--primary" : "btn--ghost"
                  }`}
                >
                  همه
                </Link>
                {YEARS.map((y) => (
                  <Link
                    key={y}
                    href={`/konkur?year=${y}${
                      field && field !== "all" ? `&field=${field}` : ""
                    }`}
                    className={`btn btn--sm ${
                      year === String(y) ? "btn--primary" : "btn--ghost"
                    }`}
                  >
                    {toFa(y)}
                  </Link>
                ))}
              </div>
            </div>

            {/* فیلتر رشته */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#666",
                  marginBottom: "8px",
                }}
              >
                🎓 رشته:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link
                  href={`/konkur${
                    year && year !== "all" ? `?year=${year}` : ""
                  }`}
                  className={`btn btn--sm ${
                    !field || field === "all" ? "btn--primary" : "btn--ghost"
                  }`}
                >
                  همه
                </Link>
                {FIELDS.map((f) => (
                  <Link
                    key={f.value}
                    href={`/konkur?field=${encodeURIComponent(f.value)}${
                      year && year !== "all" ? `&year=${year}` : ""
                    }`}
                    className={`btn btn--sm ${
                      field === f.value ? "btn--primary" : "btn--ghost"
                    }`}
                  >
                    {f.icon} {f.value}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* لیست */}
          {sortedYears.length === 0 ? (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "60px 20px",
                textAlign: "center",
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                color: "#999",
              }}
            >
              📚 هنوز کنکوری اضافه نشده است. به‌زودی...
            </div>
          ) : (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {sortedYears.map((yearNum) => {
                const fields = Object.keys(groupedData[yearNum]).sort();
                const totalInYear = fields.reduce(
                  (sum, f) => sum + groupedData[yearNum][f].length,
                  0
                );

                return (
                  <div key={yearNum}>
                    {/* هدر سال */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "20px",
                        paddingBottom: "16px",
                        borderBottom: "3px solid #f0f0f0",
                        flexWrap: "wrap",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "24px",
                          fontWeight: 800,
                          color: "#1a1a1a",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #0066cc, #7c3aed)",
                            color: "#fff",
                            padding: "6px 16px",
                            borderRadius: "10px",
                            fontSize: "18px",
                          }}
                        >
                          {toFa(yearNum)}
                        </span>
                        کنکور {toFa(yearNum)}
                      </h2>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          background: "#f0f7ff",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontWeight: 700,
                        }}
                      >
                        {toFa(totalInYear)} فایل
                      </span>
                    </div>

                    {/* رشته‌ها */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      {fields.map((fieldName) => {
                        const fieldInfo = FIELDS.find(
                          (f) => f.value === fieldName
                        );
                        const icon = fieldInfo?.icon || "📚";
                        const items = groupedData[yearNum][fieldName];

                        return (
                          <div key={fieldName}>
                            {/* هدر رشته */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "12px",
                                paddingRight: "12px",
                                borderRight: `4px solid ${
                                  fieldInfo?.color || "#0066cc"
                                }`,
                              }}
                            >
                              <span style={{ fontSize: "22px" }}>{icon}</span>
                              <h3
                                style={{
                                  fontSize: "17px",
                                  fontWeight: 700,
                                  color: "#1a1a1a",
                                  margin: 0,
                                }}
                              >
                                {fieldName}
                              </h3>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#999",
                                  background: "#f8f9fa",
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                }}
                              >
                                {toFa(items.length)}
                              </span>
                            </div>

                            {/* فایل‌ها */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(240px, 1fr))",
                                gap: "10px",
                              }}
                            >
                              {items.map((item) => (
                                <Link
                                  key={item.id}
                                  href={`/konkur/${item.slug}`}
                                  style={{
                                    display: "block",
                                    background: "#fff",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #e5e5e5",
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  {item.subtitle && (
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#0066cc",
                                        marginBottom: "8px",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.subtitle}
                                    </div>
                                  )}
                                  {!item.subtitle && (
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#1a1a1a",
                                        marginBottom: "8px",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.title}
                                    </div>
                                  )}

                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#666",
                                      display: "flex",
                                      gap: "8px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {item.questionUrl && (
                                      <span
                                        style={{
                                          background: "#dbeafe",
                                          color: "#1e40af",
                                          padding: "2px 8px",
                                          borderRadius: "6px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        📄 دفترچه
                                      </span>
                                    )}
                                    {item.answerUrl && (
                                      <span
                                        style={{
                                          background: "#d1fae5",
                                          color: "#065f46",
                                          padding: "2px 8px",
                                          borderRadius: "6px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        ✅ کلید
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}