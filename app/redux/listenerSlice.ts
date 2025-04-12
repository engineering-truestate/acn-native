import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unsubscribe } from 'firebase/firestore';

interface ListenerState {
  unsubscribeAgentListener: Unsubscribe | null;
  unsubscribeVersionListener: Unsubscribe | null;
}

const initialState: ListenerState = {
  unsubscribeAgentListener: null,
  unsubscribeVersionListener: null,
};

export const listenerSlice = createSlice({
  name: 'listeners',
  initialState,
  reducers: {
    setAgentListener: (state, action: PayloadAction<Unsubscribe>) => {
      state.unsubscribeAgentListener = action.payload;
    },
    clearAgentListener: (state) => {
      if (state.unsubscribeAgentListener) {
        state.unsubscribeAgentListener(); // ✅ Call unsubscribe
        state.unsubscribeAgentListener = null;
      }
    },
    setVersionListener: (state, action: PayloadAction<Unsubscribe>) => {
      state.unsubscribeVersionListener = action.payload;
    },
    clearVersionListener: (state) => {
      if (state.unsubscribeVersionListener) {
        state.unsubscribeVersionListener(); // ✅ Call unsubscribe
        state.unsubscribeVersionListener = null;
      }
    },
  },
});

export const {
  setAgentListener,
  clearAgentListener,
  setVersionListener,
  clearVersionListener,
} = listenerSlice.actions;

export default listenerSlice.reducer;
