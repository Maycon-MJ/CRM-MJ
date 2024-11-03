import React from 'react';
import { SalesOpportunity, Customer, Product } from '../../types/types';

interface OpportunityFormProps {
  onSubmit: (opportunity: Omit<SalesOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  customers: Customer[];
  products: Product[];
  initialData?: SalesOpportunity;
  isEditing?: boolean;
}

export default function OpportunityForm({
  onSubmit,
  customers,
  products,
  initialData,
  isEditing,
}: OpportunityFormProps) {
  const [formData, setFormData] = React.useState({
    customerId: initialData?.customerId || '',
    productId: initialData?.productId || '',
    estimatedValue: initialData?.estimatedValue || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    expectedCloseDate: initialData?.expectedCloseDate || '',
    closeProbability: initialData?.closeProbability || 50,
    status: initialData?.status || 'negotiation',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedValue' || name === 'closeProbability' ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Selecione um cliente</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.company}
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
          <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700">
            Valor Estimado (R$)
          </label>
          <input
            type="number"
            id="estimatedValue"
            name="estimatedValue"
            value={formData.estimatedValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="closeProbability" className="block text-sm font-medium text-gray-700">
            Probabilidade de Fechamento (%)
          </label>
          <input
            type="number"
            id="closeProbability"
            name="closeProbability"
            value={formData.closeProbability}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700">
            Previsão de Fechamento
          </label>
          <input
            type="date"
            id="expectedCloseDate"
            name="expectedCloseDate"
            value={formData.expectedCloseDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

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
            <option value="negotiation">Em Negociação</option>
            <option value="proposalSent">Proposta Enviada</option>
            <option value="analysis">Em Análise</option>
            <option value="closed">Fechado</option>
            <option value="lost">Perdido</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar Oportunidade'}
        </button>
      </div>
    </form>
  );
}