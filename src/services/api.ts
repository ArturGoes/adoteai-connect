import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types matching backend
export interface Animal {
  id: number;
  nome: string;
  raca: string;
  idade: string;
  porte: string;
  localizacao: string;
  historia: string;
  temperamento: string[];
  larIdeal: string;
  imagemUrl: string;
  fotos: string[];
  disponivel: boolean;
  vacinasTomadas: string[];
  vacinasPendentes: string[];
}

export interface MatchRequest {
  espacoEmCasa: number;
  tempoDisponivel: number;
  preferenciaTemperamento: number;
}

export interface MatchResponse {
  success: boolean;
  animal: Animal;
  matchScore: number;
  iaReasoning: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    email: string;
    nome: string;
  };
  message?: string;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};

// Match API (IA)
export const matchApi = {
  findMatch: async (data: MatchRequest): Promise<MatchResponse> => {
    const response = await api.post<MatchResponse>('/match', data);
    return response.data;
  },
};

// Animals API
export const animalsApi = {
  getAll: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animals');
    return response.data;
  },
  getById: async (id: number): Promise<Animal> => {
    const response = await api.get<Animal>(`/animals/${id}`);
    return response.data;
  },
};

export default api;
