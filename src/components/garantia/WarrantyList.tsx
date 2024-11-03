import React from 'react';
import { WarrantyClaim, Product, WarrantyHistory } from '../../types/types';
import { Search, Edit2, Trash2, PlusCircle, Clock } from 'lucide-react';

interface WarrantyListProps {
  warranties: WarrantyClaim[];
  products: Product[];
  onEdit: (claim: WarrantyClaim) => void;
  onDelete: (id: string) => void;
  onAddHistory: (id: string, entry: Omit<WarrantyHistory, 'id' | 'date'>) => void;
}

export default function WarrantyList({
  warranties,
  products,
  onEdit,
  onDelete,
  onAddHistory,
}: WarrantyListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<WarrantyClaim['status'] | 'all'>('all');
  const [selectedClaim, setSelectedClaim] = React.useState<WarrantyClaim | null>(null);
  const [showHistoryForm, setShowHistoryForm] = React.useState(false);
  const [historyForm, setHistoryForm] = React.useState({
    action: '',
    details: '',
    replacement: '',
    repair: '',
    responsible: '',
  });

  const filteredWarranties = React.useMemo(() => {
    return warranties.filter(warranty => {
      const product = products.find(p => p.id === warranty.productId);
      const matchesSearch = !search || 
        warranty.customer.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || warranty.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [warranties, products, search, statusFilter]);

  const getStatusColor = (status: WarrantyClaim['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: WarrantyClaim['status']) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'analyzing':
        return 'Em Análise';
      case 'resolved':
        return 'Resolvido';
      case 'closed':
        return 'Fechado';
    }
  };

  const handleAddHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClaim) {
      onAddHistory(selectedClaim.id, historyForm);
      setHistoryForm({
        action: '',
        details: '',
        replacement: '',
        repair: '',
        responsible: '',
      });
      setShowHistoryForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar chamados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WarrantyClaim['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="open">Aberto</option>
          <option value="analyzing">Em Análise</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Atendimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWarranties.map((warranty) => {
              const product = products.find(p => p.id === warranty.productId);
              const lastHistory = warranty.history[warranty.history.length - 1];
              return (
                <tr key={warranty.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {warranty.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(warranty.claimDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(warranty.status)}`}>
                      {getStatusText(warranty.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lastHistory ? (
                      <div>
                        <p>{lastHistory.action}</p>
                        <p className="text-xs text-gray-400">{new Date(lastHistory.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">Por: {lastHistory.responsible}</p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(warranty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClaim(warranty);
                          setShowHistoryForm(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(warranty.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showHistoryForm && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Adicionar Registro de Atendimento</h3>
            <form onSubmit={handleAddHistory} className="space-y-4">
              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                  Ação Realizada
                </label>
                <input
                  type="text"
                  id="action"
                  value={historyForm.action}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, action: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                  Detalhes
                </label>
                <textarea
                  id="details"
                  value={historyForm.details}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, details: e.target.value }))}
                  required
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="replacement" className="block text-sm font-medium text-gray-700">
                  Substituição (se aplicável)
                </label>
                <input
                  type="text"
                  id="replacement"
                  value={historyForm.replacement}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, replacement: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="repair" className="block text-sm font-medium text-gray-700">
                  Reparo (se aplicável)
                </label>
                <input
                  type="text"
                  id="repair"
                  value={historyForm.repair}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, repair: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  id="responsible"
                  value={historyForm.responsible}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, responsible: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowHistoryForm(false);
                    setSelectedClaim(null);
                    setHistoryForm({
                      action: '',
                      details: '',
                      replacement: '',
                      repair: '',
                      responsible: '',
                    });
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