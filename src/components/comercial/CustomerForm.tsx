import React from 'react';
import { Customer } from '../../types/types';
import { Upload } from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Customer;
  isEditing?: boolean;
}

export default function CustomerForm({ onSubmit, initialData, isEditing }: CustomerFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    contact: initialData?.contact || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    status: initialData?.status || 'potential',
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Cliente
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
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
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

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
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
            <option value="potential">Potencial</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
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
          {isEditing ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}