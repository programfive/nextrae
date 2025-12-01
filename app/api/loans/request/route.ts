import { createLoan } from "@/actions/loans";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const schema = z.object({
      materialId: z.string().min(1, "materialId requerido"),
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

    const { materialId } = parsed.data;
    const result = await createLoan(materialId);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "No se pudo crear el préstamo" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
