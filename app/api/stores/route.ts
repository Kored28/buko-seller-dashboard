import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    try {
        const { userId } = await auth();
        const body = await req.json()

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name } = body;

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store)

    } catch (error) {
        console.log("[STORES_POST]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};

export async function GET (req: Request) {
    try {

        const store = await prismadb.store.findMany({});

        return NextResponse.json(store)

    } catch (error) {
        console.log("[STORES_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};