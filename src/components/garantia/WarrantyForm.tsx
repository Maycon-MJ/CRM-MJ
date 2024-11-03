import React from 'react';
import { WarrantyClaim, Product } from '../../types/types';

interface WarrantyFormProps {
  onSubmit: (claim: Omit<WarrantyClaim, 'id' | 'history' | 'createdAt' | 'updatedAt'>) => void;
  products: Product[];
  initialData?: WarrantyClaim;
  isEditing?: boolean;
}

export default function WarrantyForm({
  onSubmit,
  products,
  initialData,
  isEditing,
}: WarrantyFormProps) {
  const [formData, setFormData] = React.useState({
    productId: initialData?.productId || '',
    customer: initialData?.customer || '',
    claimDate: initialData?.claimDate || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    status: initialData?.status || 'open',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Produto
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Selecione um produto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="claimDate" className="block text-sm font-medium text-gray-700">
            Data do Chamado
          </label>
          <input
            type="date"
            id="claimDate"
            name="claimDate"
            value={formData.claimDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        {isEditing && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1"
            >
              <option value="open">Aberto</option>
              <option value="analyzing">Em Análise</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição do Problema
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1"
            placeholder="Descreva detalhadamente o problema relatado..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar Chamado'}
        </button>
      </div>
    </form>
  );
}