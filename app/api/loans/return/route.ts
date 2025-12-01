import { returnLoan } from "@/actions/loans";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const schema = z.object({
      loanId: z.string().min(1, "loanId requerido"),
    });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { loanId } = parsed.data;
    const result = await returnLoan(loanId);
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error ?? "No se pudo marcar el préstamo como devuelto",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
