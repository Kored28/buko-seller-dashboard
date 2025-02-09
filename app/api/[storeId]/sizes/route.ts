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
        const { name, value } = body;
        
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        
        if(!value) {
            return new NextResponse("Value is Required", { status: 400 });
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

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId
            }
        });

        return NextResponse.json(size)

    } catch (error) {
        console.log("[SiZE_POST]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};

export async function GET (req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { storeId } = params;

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 });
        }


        const sizes = await prismadb.size.findMany({
            where: {
                storeId
            }
        });

        return NextResponse.json(sizes)

    } catch (error) {
        console.log("[SIZES_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};