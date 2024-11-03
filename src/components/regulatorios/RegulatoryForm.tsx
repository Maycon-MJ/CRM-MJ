import React from 'react';
import { RegulatoryDocument, Product } from '../../types/types';
import { Upload } from 'lucide-react';

interface RegulatoryFormProps {
  onSubmit: (document: Omit<RegulatoryDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  products: Product[];
  initialData?: RegulatoryDocument;
  isEditing?: boolean;
}

export default function RegulatoryForm({
  onSubmit,
  products,
  initialData,
  isEditing,
}: RegulatoryFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    number: initialData?.number || '',
    issueDate: initialData?.issueDate || new Date().toISOString().split('T')[0],
    validityDate: initialData?.validityDate || '',
    productId: initialData?.productId || '',
    status: initialData?.status || 'pending',
    documentUrl: initialData?.documentUrl || '',
    documentType: initialData?.documentType || '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload this file to a server
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      documentUrl: url,
      documentType: file.type,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Documento
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
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
            Data de Emissão
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="validityDate" className="block text-sm font-medium text-gray-700">
            Data de Validade
          </label>
          <input
            type="date"
            id="validityDate"
            name="validityDate"
            value={formData.validityDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Produto Relacionado
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
            <option value="updated">Atualizado</option>
            <option value="expired">Expirado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Documento
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload de arquivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
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
          {formData.documentUrl && (
            <div className="mt-2">
              <a
                href={formData.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Visualizar documento
              </a>
            </div>
          )}
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
            placeholder="Adicione observações relevantes sobre o documento..."
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