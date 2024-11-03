import React from 'react';
import { ProductionOrder, Product } from '../../types/types';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface ProductionOrderListProps {
  orders: ProductionOrder[];
  products: Product[];
  onEdit: (order: ProductionOrder) => void;
  onDelete: (id: string) => void;
}

export default function ProductionOrderList({
  orders,
  products,
  onEdit,
  onDelete,
}: ProductionOrderListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<ProductionOrder['status'] | 'all'>('all');
  const [dateRange, setDateRange] = React.useState({
    start: '',
    end: '',
  });

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const product = products.find(p => p.id === order.productId);
      const matchesSearch = !search || 
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const matchesDate = (!dateRange.start || order.startDate >= dateRange.start) &&
        (!dateRange.end || order.startDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, products, search, statusFilter, dateRange]);

  const getStatusColor = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'planned':
        return 'Planejado';
      case 'inProgress':
        return 'Em Produção';
      case 'delayed':
        return 'Atrasado';
      case 'completed':
        return 'Finalizado';
    }
  };

  const calculateDelay = (order: ProductionOrder) => {
    if (order.status === 'completed' && order.actualEndDate) {
      const expected = new Date(order.expectedEndDate);
      const actual = new Date(order.actualEndDate);
      const diff = actual.getTime() - expected.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} dias de atraso` : 'No prazo';
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Buscar ordens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProductionOrder['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="planned">Planejado</option>
          <option value="inProgress">Em Produção</option>
          <option value="delayed">Atrasado</option>
          <option value="completed">Finalizado</option>
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID da Ordem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Início
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previsão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atraso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const product = products.find(p => p.id === order.productId);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.expectedEndDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateDelay(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(order)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
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