import prismadb from '@/lib/prismadb'
import React from 'react'
import { SizeForm } from './components/size-form'

interface SizePageProps {
  params: { sizeId: string }
}

const SizePage: React.FC<SizePageProps> = async({
  params
}) => {
  const  { sizeId } = await params
  
  if (sizeId === "new") {
      return (
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm initialData={null} />
          </div>
        </div>
      );
  }

  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId
    }
  });

  return (
    <div className='flex-col'>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm 
          initialData={size}
        />
      </div>
    </div>
  )
}

export default SizePage