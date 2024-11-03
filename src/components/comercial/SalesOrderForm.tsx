import React from 'react';
import { SalesOrder, Customer, Product } from '../../types/types';
import { Upload } from 'lucide-react';

interface SalesOrderFormProps {
  onSubmit: (order: Omit<SalesOrder, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => void;
  customers: Customer[];
  products: Product[];
  initialData?: SalesOrder;
  isEditing?: boolean;
}

export default function SalesOrderForm({
  onSubmit,
  customers,
  products,
  initialData,
  isEditing,
}: SalesOrderFormProps) {
  const [formData, setFormData] = React.useState({
    customerId: initialData?.customerId || '',
    productId: initialData?.productId || '',
    quantity: initialData?.quantity || 1,
    finalValue: initialData?.finalValue || 0,
    orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'finalValue' ? Number(value) : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real application, you would upload these files to a server
    // For now, we'll just show a message
    alert('Em um ambiente de produção, os arquivos seriam enviados para o servidor.');
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
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="finalValue" className="block text-sm font-medium text-gray-700">
            Valor Final (R$)
          </label>
          <input
            type="number"
            id="finalValue"
            name="finalValue"
            value={formData.finalValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">
            Data do Pedido
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
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
            <option value="pending">Pendente</option>
            <option value="processing">Em Processamento</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Documentos
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload de arquivos</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC até 10MB
              </p>
            </div>
          </div>
        </div>
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