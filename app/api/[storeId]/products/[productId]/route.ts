import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, 
    { params }: { params: { productId: string } }
) {
    try {
        const { productId } = params;


        if(!productId) {
            return new NextResponse("Product Id is required", { status: 400 })
        }


        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status : 500});
    }
};

export async function PATCH(req: Request, 
    { params }: { params: { storeId: string, productId: string } 
}) {
    try {
        const { userId } = await auth();
        
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        const body = await req.json()

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

        const { storeId, productId } = params
        
        if(!storeId) {
            return new NextResponse("Store Id is required", { status: 400 })
        }

        if(!productId) {
            return new NextResponse("Product Id is required", { status: 400 })
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

        await prismadb.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived,
            }
        })

        const product = await prismadb.product.update({
            where: {
                id: productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [ ...images.map((image: { url: string }) => image) ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status : 500});
    }
};


export async function DELETE(
    req: Request, 
    { params }: { params: { storeId: string, productId: string } 
}) {
    try {
        const { userId } = await auth();

        const { storeId, productId } = params;
        
        if(!userId){
            return new NextResponse("unauthenticated", { status: 401 });
        }


        if(!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if(!productId) {
            return new NextResponse("Product Id is required", { status: 400 })
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: productId,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal error", { status : 500});
    }
}