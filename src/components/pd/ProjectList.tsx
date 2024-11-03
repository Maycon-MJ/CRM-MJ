import React from 'react';
import { RDProject, Product, ProjectUpdate, ProjectMetrics } from '../../types/types';
import { Search, Edit2, Trash2, PlusCircle } from 'lucide-react';

interface ProjectListProps {
  projects: RDProject[];
  products: Product[];
  onEdit: (project: RDProject) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: RDProject['status']) => void;
  onAddUpdate: (id: string, update: Omit<ProjectUpdate, 'id' | 'date'>) => void;
  onUpdateMetrics: (id: string, metrics: ProjectMetrics) => void;
}

export default function ProjectList({
  projects,
  products,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddUpdate,
  onUpdateMetrics,
}: ProjectListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<RDProject['status'] | 'all'>('all');
  const [selectedProject, setSelectedProject] = React.useState<RDProject | null>(null);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const [updateContent, setUpdateContent] = React.useState('');
  const [updateResponsible, setUpdateResponsible] = React.useState('');

  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !search || 
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const getStatusColor = (status: RDProject['status']) => {
    switch (status) {
      case 'research':
        return 'bg-purple-100 text-purple-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RDProject['status']) => {
    switch (status) {
      case 'research':
        return 'Em Pesquisa';
      case 'development':
        return 'Em Desenvolvimento';
      case 'testing':
        return 'Em Testes';
      case 'completed':
        return 'Finalizado';
    }
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && updateContent && updateResponsible) {
      onAddUpdate(selectedProject.id, {
        content: updateContent,
        responsible: updateResponsible,
      });
      setUpdateContent('');
      setUpdateResponsible('');
      setShowUpdateForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RDProject['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="research">Em Pesquisa</option>
          <option value="development">Em Desenvolvimento</option>
          <option value="testing">Em Testes</option>
          <option value="completed">Finalizado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => {
          const product = products.find(p => p.id === project.targetProduct);
          return (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Produto Alvo:</span> {product?.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Orçamento:</span> R$ {project.budget.toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Progresso:</span> {project.progress}%
                  </p>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${project.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="space-x-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowUpdateForm(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              </div>

              {project.updates.length > 0 && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Últimas Atualizações</h4>
                  <div className="space-y-2">
                    {project.updates.slice(-2).map(update => (
                      <div key={update.id} className="text-sm">
                        <p className="text-gray-600">{update.content}</p>
                        <p className="text-gray-400">
                          {new Date(update.date).toLocaleDateString()} - {update.responsible}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showUpdateForm && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Adicionar Atualização</h3>
            <form onSubmit={handleAddUpdate} className="space-y-4">
              <div>
                <label htmlFor="updateContent" className="block text-sm font-medium text-gray-700">
                  Conteúdo
                </label>
                <textarea
                  id="updateContent"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  required
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="updateResponsible" className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  id="updateResponsible"
                  value={updateResponsible}
                  onChange={(e) => setUpdateResponsible(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setSelectedProject(null);
                    setUpdateContent('');
                    setUpdateResponsible('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}