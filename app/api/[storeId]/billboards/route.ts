import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (req: Request,  { params }:{ params: { storeId: string } }
) {
    try {
        const { userId } = await auth();        
        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        const body = await req.json();
        const { label, imageUrl } = body;
        
        if(!label) {
            return new NextResponse("Label is Required", { status: 400 });
        }
        
        if(!imageUrl) {
            return new NextResponse("Image URL is Required", { status: 400 });
        }
        
        const { storeId } = params
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId
            }
        });

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_POST]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};

export async function GET (req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { storeId } =  params;

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 });
        }


        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId
            }
        });

        return NextResponse.json(billboards)

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};