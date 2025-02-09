import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, 
    { params }: { params: { billboardId: string } }
) {
    try {
        const { billboardId } = params;


        if(!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 })
        }


        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    }
};

export async function PATCH(req: Request, 
    { params }: { params: { storeId: string, billboardId: string } 
}) {
    try {
        const { userId } = await auth();
        
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        const body = await req.json()

        const { label, imageUrl } = body

        if(!label) {
            return new NextResponse("label is required", { status: 400 })
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 })
        }

        const { storeId, billboardId } = params
        
        if(!storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
        }

        if(!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 })
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error", { status : 500});
    }
};


export async function DELETE(
    req: Request, 
    { params }: { params: { storeId: string, billboardId: string } 
}) {
    try {
        const { userId } = await auth();

        const { storeId, billboardId } = params;
        
        if(!userId){
            return new NextResponse("unauthenticated", { status: 401 });
        }


        if(!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 })
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: billboardId,
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status : 500});
    }
}