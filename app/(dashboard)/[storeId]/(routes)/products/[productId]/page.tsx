import prismadb from '@/lib/prismadb'
import React from 'react'
import { ProductForm } from './components/product-form'

interface ProductPageProps {
  params: { productId: string, storeId: string }
}

const ProductPage: React.FC<ProductPageProps> = async({
    params
}) => {
    const  { productId, storeId } = await params
    

    const categories = await prismadb.category.findMany({
      where: {
        storeId
      }
    });

    const sizes = await prismadb.size.findMany({
      where: {
        storeId
      }
    });

    
    if (productId === "new") {
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <ProductForm 
              categories={categories}
              sizes={sizes}
              initialData={null} />
            </div>
          </div>
        );
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId
      },
      include: {
        images: true
      }
    });
   
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm
              categories={categories}
              sizes={sizes}
              initialData={product}
            />
        </div>
    </div>
  )
}

export default ProductPage