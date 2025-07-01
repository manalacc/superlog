import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const hasEmail = searchParams.get("hasEmail");


  let entries;
  if (email) {
    // Return only entries matching the email
    entries = await prisma.entry.findMany({ where: { email } });
  } else if (hasEmail === "true") {
    // Only entries where email is not null
    entries = await prisma.entry.findMany({ where: { NOT: { email: null } } });
  } else {
    // Return all entries
    entries = await prisma.entry.findMany();
  }

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const entry = await prisma.entry.create({ data });
    return NextResponse.json(entry);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}