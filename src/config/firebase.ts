import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { User } from '../types/types';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    uid: '1',
    username: 'admin',
    role: 'admin',
    name: 'Administrador',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    uid: '2',
    username: 'compras',
    role: 'compras',
    name: 'Gestor de Compras',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    uid: '3',
    username: 'pcp',
    role: 'pcp',
    name: 'Gestor de PCP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    uid: '4',
    username: 'pd',
    role: 'pd',
    name: 'Gestor de P&D',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    uid: '5',
    username: 'garantia',
    role: 'garantia',
    name: 'Gestor de Garantia',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    uid: '6',
    username: 'regulatorios',
    role: 'regulatorios',
    name: 'Gestor de Regulatórios',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    uid: '7',
    username: 'comercial',
    role: 'comercial',
    name: 'Gestor Comercial',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Auth service with mock functionality
const auth = {
  async signInWithEmailAndPassword(email: string, password: string) {
    const username = email.split('@')[0];
    const user = mockUsers.find(u => u.username === username);
    
    if (user && password === `${username}123`) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { user: { uid: user.uid } };
    }
    
    throw new Error('Invalid credentials');
  },

  async signOut() {
    localStorage.removeItem('currentUser');
  },

  onAuthStateChanged(callback: (user: any) => void) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      callback(JSON.parse(storedUser));
    } else {
      callback(null);
    }
    return () => {};
  },
};

export { auth, mockUsers };