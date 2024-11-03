import React from 'react';
import { RDProject, Product } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProjectForm from '../components/pd/ProjectForm';
import ProjectList from '../components/pd/ProjectList';
import { PlusCircle, BarChart2 } from 'lucide-react';

export default function PDPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [products] = useLocalStorage<Product[]>('akron-products', []);
  const [projects, setProjects] = useLocalStorage<RDProject[]>('akron-rd-projects', []);
  const [editingProject, setEditingProject] = React.useState<RDProject | null>(null);

  const calculateMetrics = () => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === 'development').length;
    const research = projects.filter(p => p.status === 'research').length;
    const completed = projects.filter(p => p.status === 'completed').length;

    return {
      total,
      inProgress,
      research,
      completed,
    };
  };

  const metrics = calculateMetrics();

  const handleProjectSubmit = (projectData: Omit<RDProject, 'id' | 'documents' | 'updates' | 'metrics' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      const updatedProject = {
        ...editingProject,
        ...projectData,
        updatedAt: new Date().toISOString(),
      };
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      setEditingProject(null);
    } else {
      const newProject = {
        ...projectData,
        id: crypto.randomUUID(),
        documents: [],
        updates: [],
        metrics: {
          costToDate: 0,
          developmentTime: 0,
          testsCompleted: 0,
          testsSuccessful: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
    }
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pesquisa e Desenvolvimento</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Projetos</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-yellow-50 p-3">
              <BarChart2 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Em Desenvolvimento</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-purple-50 p-3">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Em Pesquisa</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.research}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-green-50 p-3">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Finalizados</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
          <ProjectForm
            onSubmit={handleProjectSubmit}
            products={products}
            initialData={editingProject || undefined}
            isEditing={!!editingProject}
          />
        </div>
      ) : (
        <ProjectList
          projects={projects}
          products={products}
          onEdit={(project) => {
            setEditingProject(project);
            setShowForm(true);
          }}
          onDelete={(id) => {
            if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
              setProjects(projects.filter(p => p.id !== id));
            }
          }}
          onUpdateStatus={(id, status) => {
            setProjects(projects.map(p => 
              p.id === id 
                ? { ...p, status, updatedAt: new Date().toISOString() }
                : p
            ));
          }}
          onAddUpdate={(id, update) => {
            setProjects(projects.map(p => 
              p.id === id 
                ? {
                    ...p,
                    updates: [...p.updates, {
                      id: crypto.randomUUID(),
                      ...update,
                      date: new Date().toISOString(),
                    }],
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ));
          }}
          onUpdateMetrics={(id, metrics) => {
            setProjects(projects.map(p => 
              p.id === id 
                ? { ...p, metrics, updatedAt: new Date().toISOString() }
                : p
            ));
          }}
        />
      )}
    </div>
  );
}