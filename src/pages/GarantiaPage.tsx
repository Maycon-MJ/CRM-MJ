import React from 'react';
import { Product, WarrantyClaim, WarrantyHistory } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import WarrantyForm from '../components/garantia/WarrantyForm';
import WarrantyList from '../components/garantia/WarrantyList';
import { PlusCircle, BarChart2, Clock } from 'lucide-react';

export default function GarantiaPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [products] = useLocalStorage<Product[]>('akron-products', []);
  const [warranties, setWarranties] = useLocalStorage<WarrantyClaim[]>('akron-warranty-claims', []);
  const [editingClaim, setEditingClaim] = React.useState<WarrantyClaim | null>(null);

  const handleClaimSubmit = (claimData: Omit<WarrantyClaim, 'id' | 'history' | 'createdAt' | 'updatedAt'>) => {
    if (editingClaim) {
      const updatedClaim = {
        ...editingClaim,
        ...claimData,
        updatedAt: new Date().toISOString(),
      };
      setWarranties(warranties.map(w => w.id === editingClaim.id ? updatedClaim : w));
      setEditingClaim(null);
    } else {
      const newClaim = {
        ...claimData,
        id: crypto.randomUUID(),
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWarranties([...warranties, newClaim]);
    }
    setShowForm(false);
  };

  const handleAddHistory = (claimId: string, entry: Omit<WarrantyHistory, 'id' | 'date'>) => {
    setWarranties(warranties.map(w => {
      if (w.id === claimId) {
        const updatedWarranty = {
          ...w,
          status: 'resolved' as const,
          history: [...w.history, {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            ...entry,
          }],
          updatedAt: new Date().toISOString(),
        };
        return updatedWarranty;
      }
      return w;
    }));
  };

  const calculateMetrics = () => {
    const total = warranties.length;
    const resolved = warranties.filter(w => w.status === 'resolved' || w.status === 'closed').length;
    const avgResolutionTime = warranties
      .filter(w => w.status === 'resolved' || w.status === 'closed')
      .reduce((acc, curr) => {
        const start = new Date(curr.createdAt);
        const end = new Date(curr.updatedAt);
        return acc + (end.getTime() - start.getTime());
      }, 0) / (resolved || 1);

    return {
      total,
      resolved,
      avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60 * 24)), // Convert to days
      resolutionRate: total ? ((resolved / total) * 100).toFixed(1) : '0',
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Garantia</h1>
        <button
          onClick={() => {
            setEditingClaim(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Novo Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Chamados</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-green-50 p-3">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Taxa de Resolução</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.resolutionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-yellow-50 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Tempo Médio</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.avgResolutionTime} dias</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-purple-50 p-3">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Resolvidos</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingClaim ? 'Editar Chamado' : 'Novo Chamado'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingClaim(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
          <WarrantyForm
            onSubmit={handleClaimSubmit}
            products={products}
            initialData={editingClaim || undefined}
            isEditing={!!editingClaim}
          />
        </div>
      ) : (
        <WarrantyList
          warranties={warranties}
          products={products}
          onEdit={(claim) => {
            setEditingClaim(claim);
            setShowForm(true);
          }}
          onDelete={(id) => {
            if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
              setWarranties(warranties.filter(w => w.id !== id));
            }
          }}
          onAddHistory={handleAddHistory}
        />
      )}
    </div>
  );
}