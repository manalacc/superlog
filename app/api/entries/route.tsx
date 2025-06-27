import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const entries = await prisma.entry.findMany();
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