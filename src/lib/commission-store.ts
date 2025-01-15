import { create } from 'zustand';

export interface CommissionEntry {
  id: string;
  bookName: string;
  volumes: string;  // Changed from number to string
  filesGenerated: number;
  pricePerFile: number;
  totalPrice: number;
}

export interface MonthData {
  id: string;
  month: string;
  year: number;
  entries: CommissionEntry[];
  totalAmount: number;
}

interface CommissionStore {
  currentMonth: MonthData | null;
  months: MonthData[];
  setCurrentMonth: (month: MonthData) => void;
  addEntry: (entry: Omit<CommissionEntry, 'id'>) => void;
  editEntry: (entryId: string, updatedEntry: Omit<CommissionEntry, 'id'>) => void;
  deleteEntry: (entryId: string) => void;
  createNewMonth: (month: string, year: number) => void;
  loadMonth: (monthId: string) => void;
}

const useCommissionStore = create<CommissionStore>((set, get) => ({
  currentMonth: null,
  months: loadFromStorage(),
  
  setCurrentMonth: (month) => {
    set({ currentMonth: month });
    saveToStorage(get().months);
  },
  
  addEntry: (entry) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    
    set((state) => {
      if (!state.currentMonth) return state;
      
      const updatedMonth = {
        ...state.currentMonth,
        entries: [...state.currentMonth.entries, newEntry],
        totalAmount: state.currentMonth.totalAmount + newEntry.totalPrice,
      };
      
      const updatedMonths = state.months.map((m) =>
        m.id === updatedMonth.id ? updatedMonth : m
      );
      
      saveToStorage(updatedMonths);
      
      return {
        currentMonth: updatedMonth,
        months: updatedMonths,
      };
    });
  },

  editEntry: (entryId, updatedEntry) => {
    set((state) => {
      if (!state.currentMonth) return state;

      const oldEntry = state.currentMonth.entries.find(e => e.id === entryId);
      const newEntry = { ...updatedEntry, id: entryId };
      
      const updatedMonth = {
        ...state.currentMonth,
        entries: state.currentMonth.entries.map(e => 
          e.id === entryId ? newEntry : e
        ),
        totalAmount: state.currentMonth.totalAmount - (oldEntry?.totalPrice || 0) + updatedEntry.totalPrice,
      };
      
      const updatedMonths = state.months.map((m) =>
        m.id === updatedMonth.id ? updatedMonth : m
      );
      
      saveToStorage(updatedMonths);
      
      return {
        currentMonth: updatedMonth,
        months: updatedMonths,
      };
    });
  },

  deleteEntry: (entryId) => {
    set((state) => {
      if (!state.currentMonth) return state;

      const deletedEntry = state.currentMonth.entries.find(e => e.id === entryId);
      
      const updatedMonth = {
        ...state.currentMonth,
        entries: state.currentMonth.entries.filter(e => e.id !== entryId),
        totalAmount: state.currentMonth.totalAmount - (deletedEntry?.totalPrice || 0),
      };
      
      const updatedMonths = state.months.map((m) =>
        m.id === updatedMonth.id ? updatedMonth : m
      );
      
      saveToStorage(updatedMonths);
      
      return {
        currentMonth: updatedMonth,
        months: updatedMonths,
      };
    });
  },
  
  createNewMonth: (month, year) => {
    const newMonth: MonthData = {
      id: crypto.randomUUID(),
      month,
      year,
      entries: [],
      totalAmount: 0,
    };
    
    set((state) => {
      const updatedMonths = [...state.months, newMonth];
      saveToStorage(updatedMonths);
      return {
        currentMonth: newMonth,
        months: updatedMonths,
      };
    });
  },
  
  loadMonth: (monthId) => {
    set((state) => ({
      currentMonth: state.months.find((m) => m.id === monthId) || null,
    }));
  },
}));

function loadFromStorage(): MonthData[] {
  const stored = localStorage.getItem('commission-data');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveToStorage(months: MonthData[]) {
  localStorage.setItem('commission-data', JSON.stringify(months));
}

export default useCommissionStore;