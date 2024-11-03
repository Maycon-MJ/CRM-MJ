import React from 'react';
import { PurchaseOrder, Supplier, Product } from '../../types/types';

interface PurchaseOrderFormProps {
  onSubmit: (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  suppliers: Supplier[];
  products: Product[];
  initialData?: PurchaseOrder;
  isEditing?: boolean;
}

export default function PurchaseOrderForm({
  onSubmit,
  suppliers,
  products,
  initialData,
  isEditing,
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = React.useState({
    supplierId: initialData?.supplierId || '',
    productId: initialData?.productId || '',
    quantity: initialData?.quantity || 1,
    orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0],
    expectedDeliveryDate: initialData?.expectedDeliveryDate || '',
    status: initialData?.status || 'requested',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
            Fornecedor
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

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
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">
            Data de Entrega Prevista
          </label>
          <input
            type="date"
            id="expectedDeliveryDate"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
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
              <option value="requested">Solicitado</option>
              <option value="approved">Aprovado</option>
              <option value="processing">Em Processo</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar Pedido'}
        </button>
      </div>
    </form>
  );
}