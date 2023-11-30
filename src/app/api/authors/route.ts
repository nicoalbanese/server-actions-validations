import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "@/lib/api/authors/mutations";
import { 
  authorIdSchema,
  insertAuthorParams,
  updateAuthorParams 
} from "@/lib/db/schema/authors";

export async function POST(req: Request) {
  try {
    const validatedData = insertAuthorParams.parse(await req.json());
    const { author, error } = await createAuthor(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/authors"); // optional - assumes you will have named route same as entity
    return NextResponse.json(author, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateAuthorParams.parse(await req.json());
    const validatedParams = authorIdSchema.parse({ id });

    const { author, error } = await updateAuthor(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(author, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = authorIdSchema.parse({ id });
    const { author, error } = await deleteAuthor(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(author, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
