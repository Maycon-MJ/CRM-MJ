import React from 'react';
import { Product } from '../types/types';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [search, setSearch] = React.useState('');
  const [searchField, setSearchField] = React.useState<keyof Product>('name');
  const { remove } = useFirestore<Product>('products');

  const filteredProducts = React.useMemo(() => {
    if (!search) return products;
    return products.filter(product => 
      String(product[searchField]).toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search, searchField]);

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as keyof Product)}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Nome</option>
          <option value="code">Código</option>
          <option value="classification">Classificação</option>
          <option value="supplier">Fornecedor</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.classification}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}