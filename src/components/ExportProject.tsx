import React from 'react';
import { Download, Server, Loader } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { electronFeatures } from '../config/electron';

interface ExportConfig {
  networkPath: string;
  autoSync: boolean;
  syncInterval: number;
}

export default function ExportProject() {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showConfig, setShowConfig] = React.useState(false);
  const [config, setConfig] = useLocalStorage<ExportConfig>('export-config', {
    networkPath: '',
    autoSync: true,
    syncInterval: 5,
  });

  const handleExport = async () => {
    if (!user || user.role !== 'admin') return;
    
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add project files
      const files = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'index.html',
        'src/App.tsx',
        'src/main.tsx',
        // Add other project files here
      ];

      for (const file of files) {
        try {
          const response = await fetch(`/${file}`);
          const content = await response.text();
          zip.file(file, content);
        } catch (error) {
          console.warn(`Failed to add ${file} to zip`, error);
        }
      }

      // Generate and download the zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'portal-akron-project.zip');

      // Build executable if in Electron environment
      if (electronFeatures.isElectron) {
        await electronFeatures.buildExecutable();
      }
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Erro ao exportar o projeto. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSync = async () => {
    if (!config.networkPath) {
      alert('Configure o caminho da rede primeiro!');
      setShowConfig(true);
      return;
    }

    setIsSyncing(true);
    try {
      const data = {
        products: localStorage.getItem('akron-products'),
        suppliers: localStorage.getItem('akron-suppliers'),
        orders: localStorage.getItem('akron-purchase-orders'),
        production: localStorage.getItem('akron-production-orders'),
        projects: localStorage.getItem('akron-rd-projects'),
        warranty: localStorage.getItem('akron-warranty-claims'),
        regulatory: localStorage.getItem('akron-regulatory-docs'),
        customers: localStorage.getItem('akron-customers'),
        opportunities: localStorage.getItem('akron-opportunities'),
        sales: localStorage.getItem('akron-orders'),
      };

      await electronFeatures.syncToNetwork(config.networkPath, data);
    } catch (error) {
      console.error('Error syncing data:', error);
      alert('Erro ao sincronizar dados. Tente novamente.');
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    if (config.autoSync && config.networkPath) {
      syncInterval = setInterval(handleSync, config.syncInterval * 60 * 1000);
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [config]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="space-y-4">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        {isExporting ? (
          <>
            <Loader className="animate-spin" size={18} />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span>Exportar Projeto</span>
          </>
        )}
      </button>

      {electronFeatures.isElectron && (
        <>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Server size={18} />
            <span>Configurar Sincronização</span>
          </button>

          {showConfig && (
            <div className="p-4 bg-gray-800 rounded-lg space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Caminho da Rede
                </label>
                <input
                  type="text"
                  value={config.networkPath}
                  onChange={(e) => setConfig({ ...config, networkPath: e.target.value })}
                  placeholder="\\servidor\pasta"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.autoSync}
                  onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
                  className="rounded bg-gray-700"
                />
                <label className="text-sm text-gray-400">
                  Sincronização Automática
                </label>
              </div>

              {config.autoSync && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Intervalo (minutos)
                  </label>
                  <input
                    type="number"
                    value={config.syncInterval}
                    onChange={(e) => setConfig({ ...config, syncInterval: Number(e.target.value) })}
                    min="1"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  />
                </div>
              )}

              <button
                onClick={handleSync}
                disabled={isSyncing || !config.networkPath}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Server size={18} />
                    <span>Sincronizar Agora</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}