import React from 'react';
import { RDProject, Product } from '../../types/types';
import { Upload } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (project: Omit<RDProject, 'id' | 'documents' | 'updates' | 'metrics' | 'createdAt' | 'updatedAt'>) => void;
  products: Product[];
  initialData?: RDProject;
  isEditing?: boolean;
}

export default function ProjectForm({
  onSubmit,
  products,
  initialData,
  isEditing,
}: ProjectFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetProduct: initialData?.targetProduct || '',
    budget: initialData?.budget || 0,
    responsibles: initialData?.responsibles || [''],
    status: initialData?.status || 'research',
    progress: initialData?.progress || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    expectedEndDate: initialData?.expectedEndDate || '',
    actualEndDate: initialData?.actualEndDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      responsibles: formData.responsibles.filter(r => r.trim() !== ''),
      budget: Number(formData.budget),
      progress: Number(formData.progress),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResponsibleChange = (index: number, value: string) => {
    const newResponsibles = [...formData.responsibles];
    newResponsibles[index] = value;
    setFormData(prev => ({
      ...prev,
      responsibles: newResponsibles,
    }));
  };

  const addResponsible = () => {
    setFormData(prev => ({
      ...prev,
      responsibles: [...prev.responsibles, ''],
    }));
  };

  const removeResponsible = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibles: prev.responsibles.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Projeto
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

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="targetProduct" className="block text-sm font-medium text-gray-700">
            Produto Alvo
          </label>
          <select
            id="targetProduct"
            name="targetProduct"
            value={formData.targetProduct}
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
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Orçamento (R$)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
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
                <option value="research">Em Pesquisa</option>
                <option value="development">Em Desenvolvimento</option>
                <option value="testing">Em Testes</option>
                <option value="completed">Finalizado</option>
              </select>
            </div>

            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                Progresso (%)
              </label>
              <input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                min="0"
                max="100"
                className="mt-1"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsáveis
          </label>
          {formData.responsibles.map((responsible, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={responsible}
                onChange={(e) => handleResponsibleChange(index, e.target.value)}
                placeholder="Nome do responsável"
                className="flex-1"
              />
              {formData.responsibles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResponsible(index)}
                  className="px-2 py-1 text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addResponsible}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Adicionar Responsável
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? 'Atualizar' : 'Criar Projeto'}
        </button>
      </div>
    </form>
  );
}