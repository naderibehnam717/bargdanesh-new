import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  if ((session.user as { role?: string }).role !== "admin") return false;
  return true;
}

const dataFile = path.join(process.cwd(), "src/lib/files-data.json");

async function readFiles() {
  try {
    const data = await readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFiles(files: unknown[]) {
  await writeFile(dataFile, JSON.stringify(files, null, 2), "utf-8");
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const files = await readFiles();
  return NextResponse.json(files);
}

export async function POST(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const body = await request.json();
  const files = await readFiles();

  const newFile = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
  };

  files.push(newFile);
  await writeFiles(files);

  return NextResponse.json(newFile, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "دسترسی ندارید" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
  }

  const files = await readFiles();
  const filtered = files.filter((f: { id: string }) => f.id !== id);
  await writeFiles(filtered);

  return NextResponse.json({ message: "فایل حذف شد" });
}