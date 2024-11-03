import React from 'react';
import { SalesOpportunity, Customer, Product } from '../../types/types';
import { Search, Edit2, Trash2, BarChart2 } from 'lucide-react';

interface OpportunityListProps {
  opportunities: SalesOpportunity[];
  customers: Customer[];
  products: Product[];
  onEdit: (opportunity: SalesOpportunity) => void;
  onDelete: (id: string) => void;
}

export default function OpportunityList({
  opportunities,
  customers,
  products,
  onEdit,
  onDelete,
}: OpportunityListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<SalesOpportunity['status'] | 'all'>('all');

  const filteredOpportunities = React.useMemo(() => {
    return opportunities.filter(opportunity => {
      const customer = customers.find(c => c.id === opportunity.customerId);
      const product = products.find(p => p.id === opportunity.productId);
      
      const matchesSearch = !search || 
        customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || opportunity.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [opportunities, customers, products, search, statusFilter]);

  const getStatusColor = (status: SalesOpportunity['status']) => {
    switch (status) {
      case 'negotiation':
        return 'bg-blue-100 text-blue-800';
      case 'proposalSent':
        return 'bg-yellow-100 text-yellow-800';
      case 'analysis':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: SalesOpportunity['status']) => {
    switch (status) {
      case 'negotiation':
        return 'Em Negociação';
      case 'proposalSent':
        return 'Proposta Enviada';
      case 'analysis':
        return 'Em Análise';
      case 'closed':
        return 'Fechado';
      case 'lost':
        return 'Perdido';
    }
  };

  const calculateMetrics = () => {
    const total = opportunities.length;
    const totalValue = opportunities.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const closed = opportunities.filter(o => o.status === 'closed');
    const closedValue = closed.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const avgProbability = opportunities.length
      ? opportunities.reduce((acc, curr) => acc + curr.closeProbability, 0) / opportunities.length
      : 0;

    return {
      total,
      totalValue,
      closed: closed.length,
      closedValue,
      avgProbability: Math.round(avgProbability),
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar oportunidades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SalesOpportunity['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="negotiation">Em Negociação</option>
          <option value="proposalSent">Proposta Enviada</option>
          <option value="analysis">Em Análise</option>
          <option value="closed">Fechado</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Oportunidades</p>
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
              <p className="text-sm font-medium text-gray-900">Valor Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {metrics.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-yellow-50 p-3">
              <BarChart2 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Prob. Média</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.avgProbability}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-purple-50 p-3">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Fechadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.closed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Est.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prob.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previsão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOpportunities.map((opportunity) => {
              const customer = customers.find(c => c.id === opportunity.customerId);
              const product = products.find(p => p.id === opportunity.productId);
              return (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {opportunity.estimatedValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.closeProbability}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(opportunity.status)}`}>
                      {getStatusText(opportunity.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(opportunity)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(opportunity.id)}
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
    </div>
  );
}