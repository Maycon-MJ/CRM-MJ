import React from 'react';
import { RegulatoryDocument, Product } from '../types/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import RegulatoryForm from '../components/regulatorios/RegulatoryForm';
import RegulatoryList from '../components/regulatorios/RegulatoryList';
import { PlusCircle } from 'lucide-react';

export default function RegulatoriosPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [products] = useLocalStorage<Product[]>('akron-products', []);
  const [documents, setDocuments] = useLocalStorage<RegulatoryDocument[]>('akron-regulatory-docs', []);
  const [editingDocument, setEditingDocument] = React.useState<RegulatoryDocument | null>(null);

  React.useEffect(() => {
    // Check for expired documents and update their status
    const now = new Date();
    const updatedDocs = documents.map(doc => {
      const validityDate = new Date(doc.validityDate);
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      if (validityDate < now && doc.status !== 'expired') {
        return { ...doc, status: 'expired', updatedAt: now.toISOString() };
      }
      return doc;
    });
    
    if (JSON.stringify(updatedDocs) !== JSON.stringify(documents)) {
      setDocuments(updatedDocs);
    }
  }, [documents]);

  const handleDocumentSubmit = (docData: Omit<RegulatoryDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDocument) {
      const updatedDoc = {
        ...editingDocument,
        ...docData,
        updatedAt: new Date().toISOString(),
      };
      setDocuments(documents.map(d => d.id === editingDocument.id ? updatedDoc : d));
      setEditingDocument(null);
    } else {
      const newDoc = {
        ...docData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDocuments([...documents, newDoc]);
    }
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Documentos Regulatórios</h1>
        <button
          onClick={() => {
            setEditingDocument(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Novo Documento
        </button>
      </div>

      {showForm ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingDocument ? 'Editar Documento' : 'Novo Documento'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingDocument(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
          <RegulatoryForm
            onSubmit={handleDocumentSubmit}
            products={products}
            initialData={editingDocument || undefined}
            isEditing={!!editingDocument}
          />
        </div>
      ) : (
        <RegulatoryList
          documents={documents}
          products={products}
          onEdit={(doc) => {
            setEditingDocument(doc);
            setShowForm(true);
          }}
          onDelete={(id) => {
            if (window.confirm('Tem certeza que deseja excluir este documento?')) {
              setDocuments(documents.filter(d => d.id !== id));
            }
          }}
        />
      )}
    </div>
  );
}