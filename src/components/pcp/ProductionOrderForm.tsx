import React from 'react';
import { ProductionOrder, Product } from '../../types/types';
import { Upload } from 'lucide-react';

interface ProductionOrderFormProps {
  onSubmit: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  products: Product[];
  initialData?: ProductionOrder;
  isEditing?: boolean;
}

export default function ProductionOrderForm({
  onSubmit,
  products,
  initialData,
  isEditing,
}: ProductionOrderFormProps) {
  const [formData, setFormData] = React.useState({
    orderId: initialData?.orderId || `OP${new Date().getTime()}`,
    productId: initialData?.productId || '',
    quantity: initialData?.quantity || 1,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    expectedEndDate: initialData?.expectedEndDate || '',
    actualEndDate: initialData?.actualEndDate || '',
    status: initialData?.status || 'planned',
    instructions: initialData?.instructions || '',
    attachments: initialData?.attachments || [],
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
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real application, you would upload these files to a server
    // For now, we'll create local URLs
    const newAttachments = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
            ID da Ordem
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            readOnly
            className="mt-1 bg-gray-50"
          />
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
          <label htmlFor="expectedEndDate" className="block text-sm font-medium text-gray-700">
            Data Prevista de Conclusão
          </label>
          <input
            type="date"
            id="expectedEndDate"
            name="expectedEndDate"
            value={formData.expectedEndDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        {isEditing && (
          <>
            <div>
              <label htmlFor="actualEndDate" className="block text-sm font-medium text-gray-700">
                Data Real de Conclusão
              </label>
              <input
                type="date"
                id="actualEndDate"
                name="actualEndDate"
                value={formData.actualEndDate}
                onChange={handleChange}
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
                <option value="planned">Planejado</option>
                <option value="inProgress">Em Produção</option>
                <option value="delayed">Atrasado</option>
                <option value="completed">Finalizado</option>
              </select>
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Instruções de Produção
          </label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            className="mt-1"
            placeholder="Adicione instruções detalhadas para a produção..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Anexos</label>
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
                PNG, JPG, PDF até 10MB
              </p>
            </div>
          </div>
          {formData.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Arquivos anexados:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {formData.attachments.map(attachment => (
                  <li key={attachment.id} className="py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{attachment.name}</span>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visualizar
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar Ordem de Produção'}
        </button>
      </div>
    </form>
  );
}