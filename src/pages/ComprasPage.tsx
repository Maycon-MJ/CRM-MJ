import React from 'react';
import { Product, Supplier, PurchaseOrder } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import SupplierForm from '../components/compras/SupplierForm';
import SupplierList from '../components/compras/SupplierList';
import PurchaseOrderForm from '../components/compras/PurchaseOrderForm';
import PurchaseOrderList from '../components/compras/PurchaseOrderList';
import { Database, PlusCircle, Users, ShoppingBag, BarChart2, AlertCircle, TrendingUp, Boxes } from 'lucide-react';

type View = 'products' | 'suppliers' | 'orders' | null;
type FormView = 'product' | 'supplier' | 'order' | null;

export default function ComprasPage() {
  const [currentView, setCurrentView] = React.useState<View>('products');
  const [currentForm, setCurrentForm] = React.useState<FormView>(null);
  const [products, setProducts] = useLocalStorage<Product[]>('akron-products', []);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('akron-suppliers', []);
  const [orders, setOrders] = useLocalStorage<PurchaseOrder[]>('akron-purchase-orders', []);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | null>(null);
  const [editingOrder, setEditingOrder] = React.useState<PurchaseOrder | null>(null);

  const handleProductSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        ...productData,
        updatedAt: new Date().toISOString(),
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    setCurrentForm(null);
  };

  const handleSupplierSubmit = (supplierData: Omit<Supplier, 'id' | 'documents' | 'createdAt' | 'updatedAt'>) => {
    if (editingSupplier) {
      const updatedSupplier = {
        ...editingSupplier,
        ...supplierData,
        updatedAt: new Date().toISOString(),
      };
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? updatedSupplier : s));
      setEditingSupplier(null);
    } else {
      const newSupplier = {
        ...supplierData,
        id: crypto.randomUUID(),
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setCurrentForm(null);
  };

  const handleOrderSubmit = (orderData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
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
    setCurrentForm(null);
  };

  const calculateProductMetrics = () => {
    const totalProducts = products.length;
    const uniqueSuppliers = new Set(products.map(p => p.supplier)).size;
    const productsWithoutSupplier = products.filter(p => !p.supplier).length;
    const productsWithQualification = products.filter(p => p.qualification).length;

    return {
      total: totalProducts,
      uniqueSuppliers,
      withoutSupplier: productsWithoutSupplier,
      qualified: productsWithQualification,
    };
  };

  const calculateSupplierMetrics = () => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => orders.some(o => o.supplierId === s.id)).length;
    const withDocuments = suppliers.filter(s => s.documents.length > 0).length;
    const avgDeliveryTime = orders.length ? 
      orders.reduce((acc, curr) => {
        const orderDate = new Date(curr.orderDate);
        const deliveryDate = new Date(curr.expectedDeliveryDate);
        return acc + (deliveryDate.getTime() - orderDate.getTime());
      }, 0) / (orders.length * 24 * 60 * 60 * 1000) : 0;

    return {
      total: totalSuppliers,
      active: activeSuppliers,
      withDocs: withDocuments,
      avgDeliveryDays: Math.round(avgDeliveryTime),
    };
  };

  const calculateOrderMetrics = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'requested' || o.status === 'approved').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalQuantity = orders.reduce((acc, curr) => acc + curr.quantity, 0);

    return {
      total: totalOrders,
      pending: pendingOrders,
      delivered: deliveredOrders,
      totalQuantity,
    };
  };

  const productMetrics = calculateProductMetrics();
  const supplierMetrics = calculateSupplierMetrics();
  const orderMetrics = calculateOrderMetrics();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Compras</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentView('products');
              setCurrentForm(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentView === 'products' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Database size={20} />
            Produtos
          </button>
          <button
            onClick={() => {
              setCurrentView('suppliers');
              setCurrentForm(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentView === 'suppliers' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Users size={20} />
            Fornecedores
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

      {currentView === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-50 p-3">
                  <Boxes className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total de Produtos</p>
                  <p className="text-2xl font-semibold text-gray-900">{productMetrics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-green-50 p-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Fornecedores Únicos</p>
                  <p className="text-2xl font-semibold text-gray-900">{productMetrics.uniqueSuppliers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-yellow-50 p-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Sem Fornecedor</p>
                  <p className="text-2xl font-semibold text-gray-900">{productMetrics.withoutSupplier}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-purple-50 p-3">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Qualificados</p>
                  <p className="text-2xl font-semibold text-gray-900">{productMetrics.qualified}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Produtos</h2>
            <button
              onClick={() => setCurrentForm('product')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <PlusCircle size={20} />
              Novo Produto
            </button>
          </div>
          {currentForm === 'product' ? (
            <ProductForm
              onSubmit={handleProductSubmit}
              initialData={editingProduct || undefined}
              isEditing={!!editingProduct}
            />
          ) : (
            <ProductList
              products={products}
              onEdit={(product) => {
                setEditingProduct(product);
                setCurrentForm('product');
              }}
              onDelete={(id) => {
                if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                  setProducts(products.filter(p => p.id !== id));
                }
              }}
            />
          )}
        </div>
      )}

      {currentView === 'suppliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-50 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total de Fornecedores</p>
                  <p className="text-2xl font-semibold text-gray-900">{supplierMetrics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-green-50 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Fornecedores Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{supplierMetrics.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-yellow-50 p-3">
                  <Database className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Com Documentação</p>
                  <p className="text-2xl font-semibold text-gray-900">{supplierMetrics.withDocs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-purple-50 p-3">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Prazo Médio (dias)</p>
                  <p className="text-2xl font-semibold text-gray-900">{supplierMetrics.avgDeliveryDays}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fornecedores</h2>
            <button
              onClick={() => setCurrentForm('supplier')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <PlusCircle size={20} />
              Novo Fornecedor
            </button>
          </div>
          {currentForm === 'supplier' ? (
            <SupplierForm
              onSubmit={handleSupplierSubmit}
              initialData={editingSupplier || undefined}
              isEditing={!!editingSupplier}
            />
          ) : (
            <SupplierList
              suppliers={suppliers}
              onEdit={(supplier) => {
                setEditingSupplier(supplier);
                setCurrentForm('supplier');
              }}
              onDelete={(id) => {
                if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
                  setSuppliers(suppliers.filter(s => s.id !== id));
                }
              }}
            />
          )}
        </div>
      )}

      {currentView === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-50 p-3">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total de Pedidos</p>
                  <p className="text-2xl font-semibold text-gray-900">{orderMetrics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-yellow-50 p-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Pedidos Pendentes</p>
                  <p className="text-2xl font-semibold text-gray-900">{orderMetrics.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-green-50 p-3">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Pedidos Entregues</p>
                  <p className="text-2xl font-semibold text-gray-900">{orderMetrics.delivered}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-purple-50 p-3">
                  <Boxes className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Itens Pedidos</p>
                  <p className="text-2xl font-semibold text-gray-900">{orderMetrics.totalQuantity}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pedidos de Compra</h2>
            <button
              onClick={() => setCurrentForm('order')}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <PlusCircle size={20} />
              Novo Pedido
            </button>
          </div>
          {currentForm === 'order' ? (
            <PurchaseOrderForm
              onSubmit={handleOrderSubmit}
              suppliers={suppliers}
              products={products}
              initialData={editingOrder || undefined}
              isEditing={!!editingOrder}
            />
          ) : (
            <PurchaseOrderList
              orders={orders}
              suppliers={suppliers}
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