import React from 'react';
import { Supplier } from '../../types/types';

interface SupplierFormProps {
  onSubmit: (supplier: Omit<Supplier, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Supplier;
  isEditing?: boolean;
}

export default function SupplierForm({ onSubmit, initialData, isEditing }: SupplierFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    contact: initialData?.contact || '',
    products: initialData?.products || '',
    paymentTerms: initialData?.paymentTerms || '',
    deliveryTerms: initialData?.deliveryTerms || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Fornecedor
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Contato
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">
            Produtos Fornecidos
          </label>
          <textarea
            id="products"
            name="products"
            value={formData.products}
            onChange={handleChange}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
            Condições de Pagamento
          </label>
          <textarea
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="deliveryTerms" className="block text-sm font-medium text-gray-700">
            Condições de Entrega
          </label>
          <textarea
            id="deliveryTerms"
            name="deliveryTerms"
            value={formData.deliveryTerms}
            onChange={handleChange}
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}