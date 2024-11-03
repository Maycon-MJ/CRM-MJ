import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  ShoppingCart, 
  Factory, 
  Lightbulb, 
  Shield, 
  ScrollText,
  DollarSign,
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { ModuleType } from '../types/types';
import ExportProject from './ExportProject';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { user, logout, isAuthorized } = useAuth();
  const [isOpen, setIsOpen] = React.useState(true);

  const modules = [
    { id: 'compras' as ModuleType, name: 'Compras', icon: ShoppingCart },
    { id: 'pcp' as ModuleType, name: 'PCP', icon: Factory },
    { id: 'pd' as ModuleType, name: 'P&D', icon: Lightbulb },
    { id: 'garantia' as ModuleType, name: 'Garantia', icon: Shield },
    { id: 'regulatorios' as ModuleType, name: 'Regulatórios', icon: ScrollText },
    { id: 'comercial' as ModuleType, name: 'Comercial', icon: DollarSign },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">Portal Akron</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-800 rounded">
          <Menu size={24} />
        </button>
      </div>
      
      <div className="flex-1">
        <nav className="mt-8">
          {modules.map((module) => {
            const Icon = module.icon;
            const isAccessible = isAuthorized(module.id) || user?.role === 'admin';
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                disabled={!isAccessible}
                className={`w-full p-4 flex items-center gap-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${activeModule === module.id ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}
              >
                <Icon size={24} />
                {isOpen && <span>{module.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        {isOpen ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-full">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.role === 'admin' ? 'Administrador' : `Gestor de ${user?.role}`}</p>
              </div>
            </div>
            <ExportProject />
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <ExportProject />
            <button
              onClick={logout}
              className="w-full flex justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}