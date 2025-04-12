import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { RootState } from '../store'; // Adjust if your store file is elsewhere

interface KamState {
  loading: boolean;
  error: string | null;
  kamId: string | null;
  kamDocId: string | null;
  kamDocData: DocumentData | null;
}

const initialState: KamState = {
  loading: false,
  error: null,
  kamId: null,
  kamDocId: null,
  kamDocData: null,
};

// 🔄 AsyncThunk to fetch KAM details
export const setKamDataState = createAsyncThunk<
  { docData: DocumentData; docId: string }, // return type
  string, // arg type
  { state: RootState; rejectValue: string }
>(
  'kam/setKamDataState',
  async (kamId, { getState, rejectWithValue, dispatch }) => {
    const { kamId: currentKamId } = getState().kam;

    if (currentKamId === kamId) {
      return rejectWithValue('Already loaded');
    }

    dispatch(resetKamState());

    try {
      const q = query(collection(db, 'kam'), where('kamId', '==', kamId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { docData: doc.data(), docId: doc.id };
      } else {
        return rejectWithValue('No user found with this kamId.');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch KAM');
    }
  }
);

export const kamSlice = createSlice({
  name: 'kam',
  initialState,
  reducers: {
    setKamId: (state, action: PayloadAction<string>) => {
      state.kamId = action.payload;
    },
    setKamDoc: (
      state,
      action: PayloadAction<{ docData: DocumentData; docId: string }>
    ) => {
      state.kamDocData = action.payload.docData;
      state.kamDocId = action.payload.docId;
    },
    resetKamState: (state) => {
      state.loading = false;
      state.error = null;
      state.kamId = null;
      state.kamDocData = null;
      state.kamDocId = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setKamDataState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setKamDataState.fulfilled, (state, action) => {
        state.loading = false;
        state.kamDocData = action.payload.docData;
        state.kamDocId = action.payload.docId;
        state.kamId = action.meta.arg;
      })
      .addCase(setKamDataState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

// ✅ Actions
export const { setKamId, setKamDoc, resetKamState, setError } = kamSlice.actions;

// ✅ Selectors
export const selectKamState = (state: RootState) => state.kam;
export const selectKamName = (state: RootState) =>
  state.kam.kamDocData?.name || '';
export const selectKamNumber = (state: RootState) =>
  state.kam.kamDocData?.phonenumber || '';

// ✅ Reducer
export default kamSlice.reducer;
