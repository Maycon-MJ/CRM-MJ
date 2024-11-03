import React from 'react';
import { Customer, SalesOpportunity, SalesOrder, Product } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CustomerForm from '../components/comercial/CustomerForm';
import CustomerList from '../components/comercial/CustomerList';
import OpportunityForm from '../components/comercial/OpportunityForm';
import OpportunityList from '../components/comercial/OpportunityList';
import SalesOrderForm from '../components/comercial/SalesOrderForm';
import SalesOrderList from '../components/comercial/SalesOrderList';
import { Users, Target, ShoppingBag, PlusCircle } from 'lucide-react';

type View = 'customers' | 'opportunities' | 'orders' | null;
type FormView = 'customer' | 'opportunity' | 'order' | null;

export default function ComercialPage() {
  const [currentView, setCurrentView] = React.useState<View>('customers');
  const [currentForm, setCurrentForm] = React.useState<FormView>(null);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('akron-customers', []);
  const [opportunities, setOpportunities] = useLocalStorage<SalesOpportunity[]>('akron-opportunities', []);
  const [orders, setOrders] = useLocalStorage<SalesOrder[]>('akron-orders', []);
  const [products] = useLocalStorage<Product[]>('akron-products', []);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
  const [editingOpportunity, setEditingOpportunity] = React.useState<SalesOpportunity | null>(null);
  const [editingOrder, setEditingOrder] = React.useState<SalesOrder | null>(null);

  const handleCustomerSubmit = (customerData: Omit<Customer, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => {
    if (editingCustomer) {
      const updatedCustomer = {
        ...editingCustomer,
        ...customerData,
        updatedAt: new Date().toISOString(),
      };
      setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
      setEditingCustomer(null);
    } else {
      const newCustomer = {
        ...customerData,
        id: crypto.randomUUID(),
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomers([...customers, newCustomer]);
    }
    setCurrentForm(null);
  };

  const handleOpportunitySubmit = (opportunityData: Omit<SalesOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOpportunity) {
      const updatedOpportunity = {
        ...editingOpportunity,
        ...opportunityData,
        updatedAt: new Date().toISOString(),
      };
      setOpportunities(opportunities.map(o => o.id === editingOpportunity.id ? updatedOpportunity : o));
      setEditingOpportunity(null);
    } else {
      const newOpportunity = {
        ...opportunityData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOpportunities([...opportunities, newOpportunity]);
    }
    setCurrentForm(null);
  };

  const handleOrderSubmit = (orderData: Omit<SalesOrder, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => {
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
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setCurrentForm(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão Comercial</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentView('customers');
              setCurrentForm(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentView === 'customers' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Users size={20} />
            Clientes
          </button>
          <button
            onClick={() => {
              setCurrentView('opportunities');
              setCurrentForm(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentView === 'opportunities' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Target size={20} />
            Oportunidades
          </button>
          <button
            onClick={() => {
              setCurrentView('orders');
              setCurrentForm(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentView === 'orders' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <ShoppingBag size={20} />
            Pedidos
          </button>
        </div>
      </div>

      {currentView === 'customers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Clientes</h2>
            <button
              onClick={() => setCurrentForm('customer')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <PlusCircle size={20} />
              Novo Cliente
            </button>
          </div>
          {currentForm === 'customer' ? (
            <CustomerForm
              onSubmit={handleCustomerSubmit}
              initialData={editingCustomer || undefined}
              isEditing={!!editingCustomer}
            />
          ) : (
            <CustomerList
              customers={customers}
              onEdit={(customer) => {
                setEditingCustomer(customer);
                setCurrentForm('customer');
              }}
              onDelete={(id) => {
                if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
                  setCustomers(customers.filter(c => c.id !== id));
                }
              }}
            />
          )}
        </div>
      )}

      {currentView === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Oportunidades</h2>
            <button
              onClick={() => setCurrentForm('opportunity')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle size={20} />
              Nova Oportunidade
            </button>
          </div>
          {currentForm === 'opportunity' ? (
            <OpportunityForm
              onSubmit={handleOpportunitySubmit}
              customers={customers}
              products={products}
              initialData={editingOpportunity || undefined}
              isEditing={!!editingOpportunity}
            />
          ) : (
            <OpportunityList
              opportunities={opportunities}
              customers={customers}
              products={products}
              onEdit={(opportunity) => {
                setEditingOpportunity(opportunity);
                setCurrentForm('opportunity');
              }}
              onDelete={(id) => {
                if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
                  setOpportunities(opportunities.filter(o => o.id !== id));
                }
              }}
            />
          )}
        </div>
      )}

      {currentView === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pedidos</h2>
            <button
              onClick={() => setCurrentForm('order')}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <PlusCircle size={20} />
              Novo Pedido
            </button>
          </div>
          {currentForm === 'order' ? (
            <SalesOrderForm
              onSubmit={handleOrderSubmit}
              customers={customers}
              products={products}
              initialData={editingOrder || undefined}
              isEditing={!!editingOrder}
            />
          ) : (
            <SalesOrderList
              orders={orders}
              customers={customers}
              products={products}
              onEdit={(order) => {
                setEditingOrder(order);
                setCurrentForm('order');
              }}
              onDelete={(id) => {
                if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
                  setOrders(orders.filter(o => o.id !== id));
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}