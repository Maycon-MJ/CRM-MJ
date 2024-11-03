import React from 'react';
import { RegulatoryDocument, Product } from '../../types/types';
import { Search, Edit2, Trash2, AlertCircle, FileText, BarChart2 } from 'lucide-react';

interface RegulatoryListProps {
  documents: RegulatoryDocument[];
  products: Product[];
  onEdit: (document: RegulatoryDocument) => void;
  onDelete: (id: string) => void;
}

export default function RegulatoryList({
  documents,
  products,
  onEdit,
  onDelete,
}: RegulatoryListProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<RegulatoryDocument['status'] | 'all'>('all');
  const [productFilter, setProductFilter] = React.useState<string>('all');

  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => {
      const product = products.find(p => p.id === doc.productId);
      const matchesSearch = !search || 
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.number.toLowerCase().includes(search.toLowerCase()) ||
        product?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesProduct = productFilter === 'all' || doc.productId === productFilter;

      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [documents, products, search, statusFilter, productFilter]);

  const getStatusColor = (status: RegulatoryDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'updated':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RegulatoryDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'updated':
        return 'Atualizado';
      case 'expired':
        return 'Expirado';
    }
  };

  const calculateMetrics = () => {
    const total = documents.length;
    const expired = documents.filter(d => d.status === 'expired').length;
    const expiringSoon = documents.filter(d => {
      const validityDate = new Date(d.validityDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return validityDate <= thirtyDaysFromNow && d.status !== 'expired';
    }).length;

    return {
      total,
      expired,
      expiringSoon,
      updated: documents.filter(d => d.status === 'updated').length,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RegulatoryDocument['status'] | 'all')}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="updated">Atualizado</option>
          <option value="expired">Expirado</option>
        </select>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Produtos</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total de Documentos</p>
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
              <p className="text-sm font-medium text-gray-900">Atualizados</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.updated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-yellow-50 p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Vencendo em Breve</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.expiringSoon}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="rounded-md bg-red-50 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Expirados</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {metrics.expiringSoon > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-400 mr-2" size={20} />
            <p className="text-sm text-yellow-700">
              Existem {metrics.expiringSoon} documentos que vencerão nos próximos 30 dias.
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validade
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
            {filteredDocuments.map((doc) => {
              const product = products.find(p => p.id === doc.productId);
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(doc.validityDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {getStatusText(doc.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {doc.documentUrl && (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <FileText size={18} />
                        </a>
                      )}
                      <button
                        onClick={() => onEdit(doc)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
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