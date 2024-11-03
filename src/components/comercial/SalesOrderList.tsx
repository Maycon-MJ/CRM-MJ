import React from 'react';
import { SalesOrder, Customer, Product } from '../../types/types';
import { Search, Edit2, Trash2, FileText, BarChart2 } from 'lucide-react';

interface SalesOrderListProps {
  orders: SalesOrder[];
  customers: Customer[];
  products: Product[];
  onEdit: (order: SalesOrder) => void;
  onDelete: (id: string) => void;
}

export default function SalesOrderList({
  orders,
  customers,
  products,
  onEdit,
  onDelete,
}: SalesOrderListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<SalesOrder['status'] | 'all'>('all');

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const customer = customers.find(c => c.id === order.customerId);
      const product = products.find(p => p.id === order.productId);
      
      const matchesSearch = !search || 
        customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, customers, products, search, statusFilter]);

  const getStatusColor = (status: SalesOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: SalesOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em Processamento';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
    }
  };

  const calculateMetrics = () => {
    const total = orders.length;
    const totalValue = orders.reduce((acc, curr) => acc + curr.finalValue, 0);
    const delivered = orders.filter(o => o.status === 'delivered');
    const deliveredValue = delivered.reduce((acc, curr) => acc + curr.finalValue, 0);

    return {
      total,
      totalValue,
      delivered: delivered.length,
      deliveredValue,
      pending: orders.filter(o => o.status === 'pending').length,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SalesOrder['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Em Processamento</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Pedidos</p>
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
              <p className="text-sm font-medium text-gray-900">Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-purple-50 p-3">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Entregues</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.delivered}</p>
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
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
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
            {filteredOrders.map((order) => {
              const customer = customers.find(c => c.id === order.customerId);
              const product = products.find(p => p.id === order.productId);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {order.finalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {order.documents.length > 0 && (
                        <button className="text-gray-600 hover:text-gray-800">
                          <FileText size={18} />
                        </button>
                      )}
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