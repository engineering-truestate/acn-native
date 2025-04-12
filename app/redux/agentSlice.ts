import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';

import { signOut } from './authSlice';
import { setAgentListener, clearAgentListener } from './listenerSlice';

interface AgentState {
  loading: boolean;
  error: string | null;
  phonenumber: string | null;
  docData: DocumentData | null;
  docId: string | null;
  isAgentInDb: boolean;
}

const initialState: AgentState = {
  loading: false,
  error: null,
  phonenumber: null,
  docData: null,
  docId: null,
  isAgentInDb: false,
};

export const setAgentDataState = createAsyncThunk<
  { docData: DocumentData; docId: string; phonenumber: string },
  string,
  { rejectValue: string }
>(
  'agent/setAgentDataState',
  async (phonenumber, { rejectWithValue, dispatch }) => {
    try {
      const q = query(
        collection(db, 'agents'),
        where('phonenumber', '==', phonenumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0];
        return {
          docData: document.data(),
          docId: document.id,
          phonenumber,
        };
      } else {
        dispatch(signOut());
        return rejectWithValue('No user found with this phone number.');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch agent data');
    }
  }
);

// 👂 Listener for real-time changes
export const listenToAgentChanges = (agentId: string) => (dispatch: any) => {
  dispatch(clearAgentListener());

  const docRef = doc(db, 'agents', agentId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        dispatch(
          agentSlice.actions.setUserDoc({
            docData: docSnapshot.data(),
            docId: docSnapshot.id,
          })
        );
      } else {
        dispatch(agentSlice.actions.resetAgentState());
        dispatch(signOut());
      }
    },
    (error) => {
      console.error('Error listening to agent document:', error);
      dispatch(agentSlice.actions.setError(error.message));
    }
  );

  dispatch(setAgentListener(unsubscribe));
};

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setPhonenumber: (state, action: PayloadAction<string>) => {
      state.phonenumber = action.payload;
    },
    setUserDoc: (
      state,
      action: PayloadAction<{ docData: DocumentData; docId: string }>
    ) => {
      state.docData = action.payload.docData;
      state.docId = action.payload.docId;
      state.isAgentInDb = true;
    },
    setMonthlyCredit: (state, action: PayloadAction<number>) => {
      if (state.docData) {
        state.docData = {
          ...state.docData,
          monthlyCredits: action.payload,
        };
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
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateAgentDocData: (state, action: PayloadAction<DocumentData>) => {
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
        state.phonenumber = action.payload.phonenumber;
        state.isAgentInDb = true;
      })
      .addCase(setAgentDataState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch agent data';
        state.isAgentInDb = false;
      });
  },
});

export const {
  setPhonenumber,
  setUserDoc,
  setMonthlyCredit,
  resetAgentState,
  setError,
  updateAgentDocData,
} = agentSlice.actions;

// 👇 Typed selectors
export const selectVerified = (state: { agent: AgentState }) =>
  state.agent.docData?.verified ?? false;
export const selectAdmin = (state: { agent: AgentState }) =>
  state.agent.docData?.admin ?? false;
export const selectBlacklisted = (state: { agent: AgentState }) =>
  state.agent.docData?.blacklisted ?? false;
export const selectAgentName = (state: { agent: AgentState }) =>
  state.agent.docData?.name ?? '';
export const selectMyKam = (state: { agent: AgentState }) =>
  state.agent.docData?.kam ?? null;

export default agentSlice.reducer;
