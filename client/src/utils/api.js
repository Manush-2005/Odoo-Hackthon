import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        // In a real app, you'd use a proper JWT token
        config.headers.Authorization = `Bearer ${parsedUser.id}`;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Currency API
export const currencyApi = {
  // Get all countries with currencies
  getCountriesWithCurrencies: async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
      
      // Extract unique currencies with country information
      const currencyMap = new Map();
      
      response.data.forEach(country => {
        if (country.currencies) {
          Object.entries(country.currencies).forEach(([code, info]) => {
            if (!currencyMap.has(code)) {
              currencyMap.set(code, {
                currency: code,
                country: country.name.common,
                name: info.name,
                symbol: info.symbol || code
              });
            }
          });
        }
      });
      
      return Array.from(currencyMap.values()).sort((a, b) => a.currency.localeCompare(b.currency));
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Fallback currencies
      return [
        { currency: 'USD', country: 'United States', name: 'United States Dollar', symbol: '$' },
        { currency: 'EUR', country: 'Eurozone', name: 'Euro', symbol: '€' },
        { currency: 'GBP', country: 'United Kingdom', name: 'British Pound Sterling', symbol: '£' },
        { currency: 'JPY', country: 'Japan', name: 'Japanese Yen', symbol: '¥' },
        { currency: 'INR', country: 'India', name: 'Indian Rupee', symbol: '₹' },
      ];
    }
  },

  // Get exchange rates
  getExchangeRates: async (baseCurrency = 'USD') => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      return response.data.rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback rates (approximate)
      return {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        INR: 75,
      };
    }
  },

  // Convert currency
  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    try {
      if (fromCurrency === toCurrency) return amount;
      
      const rates = await currencyApi.getExchangeRates(fromCurrency);
      const convertedAmount = amount * (rates[toCurrency] || 1);
      
      return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount;
    }
  }
};

// Mock API endpoints for development
export const mockApi = {
  // Authentication
  auth: {
    signIn: async (email, password) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = [
        { id: 1, email: 'admin@company.com', name: 'John Admin', role: 'admin', companyId: 1 },
        { id: 2, email: 'manager@company.com', name: 'Sarah Manager', role: 'manager', companyId: 1 },
        { id: 3, email: 'employee@company.com', name: 'Mike Employee', role: 'employee', companyId: 1 }
      ];
      
      const user = users.find(u => u.email === email);
      if (!user || password !== 'password123') {
        throw new Error('Invalid credentials');
      }
      
      return { user, token: `mock-token-${user.id}` };
    },
    
    signUp: async (userData) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'admin',
        companyId: Date.now()
      };
      
      return { user: newUser, token: `mock-token-${newUser.id}` };
    }
  },

  // Users
  users: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        { id: 1, name: 'John Admin', email: 'admin@company.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
        { id: 2, name: 'Sarah Manager', email: 'manager@company.com', role: 'manager', status: 'active', createdAt: '2024-01-20' },
        { id: 3, name: 'Mike Employee', email: 'employee@company.com', role: 'employee', status: 'active', createdAt: '2024-01-25', managerId: 2 },
        { id: 4, name: 'Lisa Designer', email: 'lisa@company.com', role: 'employee', status: 'active', createdAt: '2024-02-01', managerId: 2 },
        { id: 5, name: 'David Developer', email: 'david@company.com', role: 'employee', status: 'inactive', createdAt: '2024-02-05' },
        { id: 6, name: 'Emma Sales Manager', email: 'emma@company.com', role: 'manager', status: 'active', createdAt: '2024-02-10' },
        { id: 7, name: 'Tom Sales Rep', email: 'tom@company.com', role: 'employee', status: 'active', createdAt: '2024-02-15', managerId: 6 }
      ];
    },
    
    create: async (userData) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id: Date.now(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
    },
    
    update: async (id, updates) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return { id, ...updates, updatedAt: new Date().toISOString() };
    },
    
    delete: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    },

    assignManager: async (userId, managerId) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { 
        success: true, 
        userId, 
        managerId,
        updatedAt: new Date().toISOString() 
      };
    }
  },

  // Expenses
  expenses: {
    getAll: async (filters = {}) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockExpenses = [
        {
          id: 1,
          title: 'Business Lunch',
          description: 'Client meeting at Restaurant XYZ',
          amount: 85.50,
          currency: 'USD',
          convertedAmount: 85.50,
          baseCurrency: 'USD',
          category: 'Meals',
          date: '2024-10-01',
          status: 'approved',
          submittedBy: { id: 3, name: 'Mike Employee' },
          approvedBy: { id: 2, name: 'Sarah Manager' },
          receiptUrl: '/mock-receipt-1.jpg',
          submittedAt: '2024-10-01T10:30:00Z',
          approvedAt: '2024-10-02T14:20:00Z'
        },
        {
          id: 2,
          title: 'Office Supplies',
          description: 'Notebooks, pens, and sticky notes',
          amount: 45.00,
          currency: 'USD',
          convertedAmount: 45.00,
          baseCurrency: 'USD',
          category: 'Office',
          date: '2024-10-02',
          status: 'pending',
          submittedBy: { id: 3, name: 'Mike Employee' },
          receiptUrl: '/mock-receipt-2.jpg',
          submittedAt: '2024-10-02T09:15:00Z'
        },
        {
          id: 3,
          title: 'Travel to Conference',
          description: 'Flight tickets for tech conference',
          amount: 450.00,
          currency: 'USD',
          convertedAmount: 450.00,
          baseCurrency: 'USD',
          category: 'Travel',
          date: '2024-10-03',
          status: 'rejected',
          submittedBy: { id: 4, name: 'Lisa Designer' },
          rejectedBy: { id: 2, name: 'Sarah Manager' },
          rejectionReason: 'Requires pre-approval for amounts over $400',
          receiptUrl: '/mock-receipt-3.jpg',
          submittedAt: '2024-10-03T16:45:00Z',
          rejectedAt: '2024-10-04T11:30:00Z'
        }
      ];
      
      return mockExpenses;
    },
    
    create: async (expenseData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: Date.now(),
        ...expenseData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: { id: 3, name: 'Current User' }
      };
    },
    
    update: async (id, updates) => {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return { id, ...updates, updatedAt: new Date().toISOString() };
    },
    
    approve: async (id, approverId) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id,
        status: 'approved',
        approvedBy: { id: approverId, name: 'Current Manager' },
        approvedAt: new Date().toISOString()
      };
    },
    
    reject: async (id, rejecterId, reason) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id,
        status: 'rejected',
        rejectedBy: { id: rejecterId, name: 'Current Manager' },
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason
      };
    }
  }
};

export default api;