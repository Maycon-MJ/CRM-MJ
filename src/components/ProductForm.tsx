import React from 'react';
import { Product } from '../types/types';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Product;
  isEditing?: boolean;
}

export default function ProductForm({ onSubmit, initialData, isEditing }: ProductFormProps) {
  const [formData, setFormData] = React.useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    classification: initialData?.classification || '',
    pi: initialData?.pi || '',
    pa: initialData?.pa || '',
    structure: initialData?.structure || '',
    specification: initialData?.specification || '',
    packaging: initialData?.packaging || '',
    lid: initialData?.lid || '',
    pot: initialData?.pot || '',
    label: initialData?.label || '',
    supplier: initialData?.supplier || '',
    qualification: initialData?.qualification || '',
    observations: initialData?.observations || '',
    others: initialData?.others || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fields = [
    { name: 'code', label: 'Código' },
    { name: 'name', label: 'Nome' },
    { name: 'classification', label: 'Classificação' },
    { name: 'pi', label: 'PI' },
    { name: 'pa', label: 'PA' },
    { name: 'structure', label: 'Estrutura' },
    { name: 'specification', label: 'Especificação' },
    { name: 'packaging', label: 'Embalagem' },
    { name: 'lid', label: 'Tampa' },
    { name: 'pot', label: 'Pote' },
    { name: 'label', label: 'Rótulo' },
    { name: 'supplier', label: 'Fornecedor' },
    { name: 'qualification', label: 'Qualificação' },
    { name: 'observations', label: 'Observações', type: 'textarea' },
    { name: 'others', label: 'Outros', type: 'textarea' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ name, label, type }) => (
          <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
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