// store/slices/kamSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../app/config/firebase';

export const setKamDataState = createAsyncThunk(
  'kam/setKamDataState',
  async (kamId: string, { getState, rejectWithValue, dispatch }) => {
    const { kamId: currentKamId } = (getState() as any).kam;
    if (currentKamId === kamId) return;

    dispatch(resetKamState());

    try {
      const q = query(collection(db, 'kam'), where('kamId', '==', kamId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return {
          docData: docSnap.data(),
          docId: docSnap.id,
        };
      } else {
        throw new Error('No user found with this phone number.');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const kamSlice = createSlice({
  name: 'kam',
  initialState: {
    loading: false,
    error: null as string | null,
    kamId: null as string | null,
    kamDocId: null as string | null,
    kamDocData: null as any,
  },
  reducers: {
    setKamId: (state, action) => {
      state.kamId = action.payload;
    },
    setKamDoc: (state, action) => {
      if (action.payload?.docData) {
        state.kamDocData = action.payload.docData;
        state.kamDocId = action.payload.docId;
      } else {
        state.kamDocData = null;
        state.kamDocId = null;
      }
    },
    resetKamState: (state) => {
      state.loading = false;
      state.error = null;
      state.kamId = null;
      state.kamDocData = null;
      state.kamDocId = null;
    },
    setError: (state, action) => {
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
        if (action.payload) {
          state.kamDocData = action.payload.docData;
          state.kamDocId = action.payload.docId;
          state.kamId = action.meta.arg;
        }
      })
      .addCase(setKamDataState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setKamId,
  setKamDoc,
  resetKamState,
  setError,
} = kamSlice.actions;

export const selectKamState = (state: any) => state?.kam;
export const selectKamName = (state: any) => state?.kam?.kamDocData?.name || '';
export const selectKamNumber = (state: any) => state?.kam?.kamDocData?.phonenumber || '';

export default kamSlice.reducer;
