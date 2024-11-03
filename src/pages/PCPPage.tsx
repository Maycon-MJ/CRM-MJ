import React from 'react';
import { ProductionOrder, Product } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProductionOrderForm from '../components/pcp/ProductionOrderForm';
import ProductionOrderList from '../components/pcp/ProductionOrderList';
import { PlusCircle, BarChart2, AlertCircle } from 'lucide-react';

export default function PCPPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [products] = useLocalStorage<Product[]>('akron-products', []);
  const [orders, setOrders] = useLocalStorage<ProductionOrder[]>('akron-production-orders', []);
  const [editingOrder, setEditingOrder] = React.useState<ProductionOrder | null>(null);

  const handleOrderSubmit = (orderData: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOrder) {
      const updatedOrder = {
        ...editingOrder,
        ...orderData,
        updatedAt: new Date().toISOString(),
      };
      setOrders(orders.map(o => o.id === editingOrder.id ? updatedOrder : o));
      setEditingOrder(null);
    } else {
      const newOrder = {
        ...orderData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setShowForm(false);
  };

  React.useEffect(() => {
    // Check for delayed orders
    const now = new Date();
    const updatedOrders = orders.map(order => {
      if (order.status !== 'completed' && order.status !== 'delayed') {
        const expectedEnd = new Date(order.expectedEndDate);
        if (now > expectedEnd) {
          return { ...order, status: 'delayed', updatedAt: now.toISOString() };
        }
      }
      return order;
    });
    
    if (JSON.stringify(updatedOrders) !== JSON.stringify(orders)) {
      setOrders(updatedOrders);
    }
  }, [orders]);

  const calculateMetrics = () => {
    const total = orders.length;
    const inProgress = orders.filter(o => o.status === 'inProgress').length;
    const delayed = orders.filter(o => o.status === 'delayed').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    return {
      total,
      inProgress,
      delayed,
      completed,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Planejamento e Controle da Produção</h1>
        <button
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Nova Ordem de Produção
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Ordens</p>
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
              <p className="text-sm font-medium text-gray-900">Em Produção</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-red-50 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Atrasadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.delayed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-green-50 p-3">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Finalizadas</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {orders.some(order => order.status === 'delayed') && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-2" size={20} />
            <p className="text-sm text-red-700">
              Existem ordens de produção atrasadas que precisam de atenção!
            </p>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingOrder ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingOrder(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
          <ProductionOrderForm
            onSubmit={handleOrderSubmit}
            products={products}
            initialData={editingOrder || undefined}
            isEditing={!!editingOrder}
          />
        </div>
      ) : (
        <ProductionOrderList
          orders={orders}
          products={products}
          onEdit={(order) => {
            setEditingOrder(order);
            setShowForm(true);
          }}
          onDelete={(id) => {
            if (window.confirm('Tem certeza que deseja excluir esta ordem de produção?')) {
              setOrders(orders.filter(o => o.id !== id));
            }
          }}
        />
      )}
    </div>
  );
}