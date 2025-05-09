import { NextResponse } from "next/server";
import { ZodError } from "zod";

// lib/errors.ts
export class BusinessError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "BusinessError";
    this.status = status;
  }
}

export function handleApiError(error: unknown) {
  console.log(error);
  if (error instanceof BusinessError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return NextResponse.json(
      { error: "Validation failed", details: issues },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
