// store/slices/agentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { signOut } from './authSlice';
import { setAgentListener, clearAgentListener } from './listenerSlice';

export const setAgentDataState = createAsyncThunk(
  'agent/setAgentDataState',
  async (phonenumber: string, { rejectWithValue, dispatch }) => {
    try {
      const q = query(collection(db, 'agents'), where('phonenumber', '==', phonenumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return {
          docData: docSnap.data(),
          docId: docSnap.id,
          phonenumber,
        };
      } else {
        dispatch(signOut());
        throw new Error('No user found with this phone number.');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const listenToAgentChanges = (agentId: string) => (dispatch: any) => {
  dispatch(clearAgentListener());
  const docRef = doc(db, 'agents', agentId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        dispatch(setUserDoc({
          docData: docSnap.data(),
          docId: docSnap.id,
        }));
      } else {
        dispatch(resetAgentState());
        dispatch(signOut());
      }
    },
    (error) => {
      console.error('Agent listener error:', error);
      dispatch(setError(error.message));
    }
  );

  dispatch(setAgentListener(unsubscribe));
};

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    loading: false,
    error: null as string | null,
    phonenumber: null as string | null,
    docData: null as any,
    docId: null as string | null,
    isAgentInDb: false,
  },
  reducers: {
    setPhonenumber: (state, action) => {
      state.phonenumber = action.payload;
    },
    setUserDoc: (state, action) => {
      const { docData, docId } = action.payload;
      if (docData) {
        state.docData = docData;
        state.docId = docId;
        state.isAgentInDb = true;
      } else {
        state.docData = null;
        state.docId = null;
        state.isAgentInDb = false;
      }
    },
    resetAgentState: (state) => {
      state.loading = false;
      state.error = null;
      state.phonenumber = null;
      state.docData = null;
      state.docId = null;
      state.isAgentInDb = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateAgentDocData: (state, action) => {
      if (state.docData) {
        state.docData = {
          ...state.docData,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAgentDataState.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAgentInDb = false;
      })
      .addCase(setAgentDataState.fulfilled, (state, action) => {
        state.loading = false;
        state.docData = action.payload.docData;
        state.docId = action.payload.docId;
        state.isAgentInDb = true;
      })
      .addCase(setAgentDataState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAgentInDb = false;
      });
  },
});

export const {
  setPhonenumber,
  setUserDoc,
  resetAgentState,
  setError,
  updateAgentDocData,
} = agentSlice.actions;

export default agentSlice.reducer;
