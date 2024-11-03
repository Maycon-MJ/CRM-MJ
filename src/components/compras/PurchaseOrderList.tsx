import React from 'react';
import { PurchaseOrder, Supplier, Product } from '../../types/types';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface PurchaseOrderListProps {
  orders: PurchaseOrder[];
  suppliers: Supplier[];
  products: Product[];
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (id: string) => void;
}

export default function PurchaseOrderList({
  orders,
  suppliers,
  products,
  onEdit,
  onDelete,
}: PurchaseOrderListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PurchaseOrder['status'] | 'all'>('all');

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const supplier = suppliers.find(s => s.id === order.supplierId);
      const product = products.find(p => p.id === order.productId);
      
      const matchesSearch = !search || 
        supplier?.name.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, suppliers, products, search, statusFilter]);

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'requested':
        return 'Solicitado';
      case 'approved':
        return 'Aprovado';
      case 'processing':
        return 'Em Processo';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
    }
  };

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
          onChange={(e) => setStatusFilter(e.target.value as PurchaseOrder['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="requested">Solicitado</option>
          <option value="approved">Aprovado</option>
          <option value="processing">Em Processo</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data do Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previsão de Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const supplier = suppliers.find(s => s.id === order.supplierId);
              const product = products.find(p => p.id === order.productId);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
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