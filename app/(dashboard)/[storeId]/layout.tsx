import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function DashboardLayout (
    { 
        params,
        children, 
    }: { 
        params: { storeId: string }
        children: React.ReactNode,
    }
) {

    const { storeId } = await params
    
    const { userId } = await auth();
    if(!userId){
        redirect("/sign-in")
    }


    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    })

    if(!store) {
        redirect("/")
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}