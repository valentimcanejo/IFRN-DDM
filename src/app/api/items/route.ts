import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const teste = ["teste", "teste2", "teste3"];

  //const token = await signInWithCustomToken(auth, customToken);

  return NextResponse.json({ array: teste });
}
