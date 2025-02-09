import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (req: Request,  { params }:{ params: Promise<{ storeId: string }> }
) {
    try {
        const { userId } = await auth();  

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await req.json();
        const { name, billboardId } = body;
        
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        
        if(!billboardId) {
            return new NextResponse("Billboard Id is Required", { status: 400 });
        }
        
        const { storeId } = await params
        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 });
        }

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId
            }
        });

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORIES_POST]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};

export async function GET (req: Request, { params }: { params: Promise<{ storeId: string }> }) {
    try {

        const { storeId } = await params;

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 });
        }


        const categories = await prismadb.category.findMany({
            where: {
                storeId
            }
        });

        return NextResponse.json(categories)

    } catch (error) {
        console.log("[CATEGORIES_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};