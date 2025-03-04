import { format } from "date-fns";

import prismadb from '@/lib/prismadb';

import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns';
import { formatter } from "@/lib/utils";

interface ProductsPageProps { 
  params: Promise<{ storeId: string }>
}

const ProductsPage: React.FC<ProductsPageProps> = async({ params }) => {
  const { storeId } = await params

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    }, 
    include: {
      category: true,
      size: true
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex-col'>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;