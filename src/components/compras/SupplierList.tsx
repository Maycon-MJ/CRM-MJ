import React from 'react';
import { Supplier } from '../../types/types';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface SupplierListProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierList({ suppliers, onEdit, onDelete }: SupplierListProps) {
  const [search, setSearch] = React.useState('');

  const filteredSuppliers = React.useMemo(() => {
    if (!search) return suppliers;
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar fornecedores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condições de Pagamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{supplier.products}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{supplier.paymentTerms}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(supplier.id)}
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