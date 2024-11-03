import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import ComprasPage from './pages/ComprasPage';
import PCPPage from './pages/PCPPage';
import PDPage from './pages/PDPage';
import GarantiaPage from './pages/GarantiaPage';
import RegulatoriosPage from './pages/RegulatoriosPage';
import ComercialPage from './pages/ComercialPage';
import { ModuleType } from './types/types';

export default function App() {
  const { user, isAuthorized } = useAuth();
  const [activeModule, setActiveModule] = React.useState<ModuleType>('compras');

  if (!user) {
    return <LoginPage />;
  }

  const renderModule = () => {
    if (!isAuthorized(activeModule) && user.role !== 'admin') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-xl text-gray-500">
              Acesso não autorizado
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Você não tem permissão para acessar este módulo
            </p>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'compras':
        return <ComprasPage />;
      case 'pcp':
        return <PCPPage />;
      case 'pd':
        return <PDPage />;
      case 'garantia':
        return <GarantiaPage />;
      case 'regulatorios':
        return <RegulatoriosPage />;
      case 'comercial':
        return <ComercialPage />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              Módulo em desenvolvimento...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
    </div>
  );
}