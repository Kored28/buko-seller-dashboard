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
        const { 
            name,
            price,
            categoryId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        
        if(!price) {
            return new NextResponse("Price is Required", { status: 400 });
        }
        
        if(!categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
        }
        
        if(!sizeId) {
            return new NextResponse("Size Id is Required", { status: 400 });
        }
        
        if(!images || !images.length) {
            return new NextResponse("Images is Required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_POST]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};

export async function GET (req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { storeId } =  params;

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 });
        }

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured") || undefined


        const products = await prismadb.product.findMany({
            where: {
                storeId,
                categoryId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products)

    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    };
};