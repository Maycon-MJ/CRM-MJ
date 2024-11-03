import { ipcRenderer } from 'electron';

interface ErrorLog {
  timestamp: string;
  error: string;
  module: string;
  details?: any;
  userId?: string;
}

class ErrorHandler {
  private static logs: ErrorLog[] = [];
  private static networkPath: string | null = null;

  static initialize(networkPath: string) {
    this.networkPath = networkPath;
    this.loadLogs();
  }

  static async handleError(error: Error, module: string, userId?: string, details?: any) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      module,
      details,
      userId,
    };

    this.logs.push(errorLog);
    await this.saveLogs();
    await this.syncLogs();

    // Show user-friendly error message
    const message = this.getUserFriendlyMessage(error, module);
    alert(message);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        error,
        module,
        details,
      });
    }
  }

  private static getUserFriendlyMessage(error: Error, module: string): string {
    const baseMessage = 'Ocorreu um erro no sistema. ';
    
    // Common error messages
    const errorMessages: Record<string, string> = {
      'NetworkError': 'Erro de conexão com a rede. Verifique sua conexão e tente novamente.',
      'SyncError': 'Erro ao sincronizar dados. Os dados serão salvos localmente e sincronizados posteriormente.',
      'AuthError': 'Erro de autenticação. Por favor, faça login novamente.',
      'DataError': 'Erro ao processar dados. Tente novamente ou contate o suporte.',
      'ValidationError': 'Dados inválidos. Verifique as informações e tente novamente.',
    };

    // Module-specific messages
    const moduleMessages: Record<string, string> = {
      'auth': 'Problema com autenticação. ',
      'sync': 'Problema com sincronização. ',
      'database': 'Problema com banco de dados. ',
      'export': 'Problema ao exportar dados. ',
      'import': 'Problema ao importar dados. ',
    };

    let message = baseMessage;
    
    // Add error type message
    for (const [errorType, errorMessage] of Object.entries(errorMessages)) {
      if (error.message.includes(errorType)) {
        message += errorMessage;
        break;
      }
    }

    // Add module-specific message
    if (moduleMessages[module]) {
      message += moduleMessages[module];
    }

    message += '\nSe o problema persistir, contate o suporte técnico.';
    return message;
  }

  private static async loadLogs() {
    try {
      if (this.networkPath) {
        const logs = await ipcRenderer.invoke('load-error-logs', this.networkPath);
        this.logs = logs;
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }

  private static async saveLogs() {
    try {
      localStorage.setItem('error-logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs locally:', error);
    }
  }

  private static async syncLogs() {
    try {
      if (this.networkPath) {
        await ipcRenderer.invoke('sync-error-logs', {
          path: this.networkPath,
          logs: this.logs,
        });
      }
    } catch (error) {
      console.error('Error syncing logs:', error);
    }
  }

  static async diagnoseIssue(module: string): Promise<string> {
    try {
      // Check network connectivity
      const networkStatus = await ipcRenderer.invoke('check-network');
      if (!networkStatus.connected) {
        return 'Problema de conexão com a rede. Verifique sua conexão.';
      }

      // Check network path accessibility
      if (this.networkPath) {
        const pathStatus = await ipcRenderer.invoke('check-network-path', this.networkPath);
        if (!pathStatus.accessible) {
          return 'Pasta de rede inacessível. Verifique as permissões.';
        }
      }

      // Check local storage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (error) {
        return 'Problema com armazenamento local. Libere espaço no disco.';
      }

      // Module-specific checks
      const moduleChecks: Record<string, () => Promise<string>> = {
        'auth': async () => {
          const authStatus = await ipcRenderer.invoke('check-auth');
          return authStatus.valid ? '' : 'Sessão expirada. Faça login novamente.';
        },
        'sync': async () => {
          const syncStatus = await ipcRenderer.invoke('check-sync');
          return syncStatus.syncing ? 'Sincronização em andamento.' : '';
        },
      };

      if (moduleChecks[module]) {
        const moduleStatus = await moduleChecks[module]();
        if (moduleStatus) {
          return moduleStatus;
        }
      }

      return 'Sistema funcionando normalmente.';
    } catch (error) {
      return 'Não foi possível diagnosticar o problema. Contate o suporte.';
    }
  }

  static getErrorStats(): { total: number; byModule: Record<string, number> } {
    const stats = {
      total: this.logs.length,
      byModule: {} as Record<string, number>,
    };

    this.logs.forEach(log => {
      if (!stats.byModule[log.module]) {
        stats.byModule[log.module] = 0;
      }
      stats.byModule[log.module]++;
    });

    return stats;
  }
}

export default ErrorHandler;