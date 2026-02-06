import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DbConnection {
  id: number;
  name: string;
  type: string;
}

interface DbState {
  connections: DbConnection[];
  activeConnection: DbConnection | null;
  loading: boolean;
  error: string | null;
}

const initialState: DbState = {
  connections: [],
  activeConnection: null,
  loading: false,
  error: null,
};

const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<DbConnection[]>) => {
      state.connections = action.payload;
    },
    setActiveConnection: (state, action: PayloadAction<DbConnection | null>) => {
      state.activeConnection = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setConnections, setActiveConnection, setLoading, setError } = dbSlice.actions;
export default dbSlice.reducer;
