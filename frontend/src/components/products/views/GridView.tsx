import React from 'react';
import { IProduct } from '../../../types/product';
import ProductCard from '../ProductCard';

interface GridViewProps {
  products: IProduct[];
  onSelect?: (id: string) => void;
  selectedIds?: string[];
}

export const GridView: React.FC<GridViewProps> = ({ products, onSelect, selectedIds }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isSelected={selectedIds?.includes(product._id)}
          onSelect={() => onSelect?.(product._id)}
        />
      ))}
    </div>
  );
}; 