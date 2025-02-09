import prismadb from '@/lib/prismadb'
import React from 'react'
import { CategoryForm } from './components/category-form';

interface CategoryPageProps {
  params: { categoryId: string, storeId: string }
}

const CategoryPage: React.FC<CategoryPageProps> = async({
  params
}) => {
  const  { categoryId, storeId } = await params

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    }
  })
  
  if (categoryId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm billboards={billboards} initialData={null} />
        </div>
      </div>
    );
  }

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    }
  });

  

  return (
    <div className='flex-col'>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm 
          billboards={billboards}
          initialData={category}
        />
      </div>
    </div>
  )
}

export default CategoryPage