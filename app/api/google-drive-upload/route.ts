import { NextResponse } from "next/server";

// Misma URL que usas en upload-test/page.tsx
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!; // o sin ! y con chequeo abajo

export async function POST(req: Request) {
  try {
    // El body será exactamente igual al que mandas desde el frontend
    const body = await req.json();

    // Hacemos la misma petición que hacías en el componente
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Intentamos leer el JSON que devuelve Apps Script
    const text = await res.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error al llamar al Apps Script", status: res.status, data },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en /api/google-drive-upload", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
