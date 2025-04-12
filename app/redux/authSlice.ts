import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store'; // adjust path as needed
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import { clearAgentListener, setVersionListener, clearVersionListener } from './listenerSlice';
import { resetAgentState } from './agentSlice';
import { resetKamState } from './kamSlice';

let timeoutId: NodeJS.Timeout | null = null;

interface AuthState {
  isAuthenticated: boolean;
  version: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  version: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state) => {
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// 🔄 Real-time Firestore listener for version changes
export const listenToVersionChanges = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(clearVersionListener());

  const currentVersion = String(getState().auth.version || '');
  const docRef = doc(db, 'admin', 'version');

  const unsubscribe: Unsubscribe = onSnapshot(
    docRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        let newVersion = String(docSnapshot.data().version);

        if (currentVersion !== newVersion) {
          console.log(`Version changed: ${currentVersion} → ${newVersion}`);
          dispatch(setVersion(newVersion));
          // You can customize how reloads work in React Native (navigation reset, etc.)
          // In Expo/Web, this reloads the app
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      }
    },
    (error) => {
      console.error('Error listening to version document:', error);
      dispatch(setError(error.message));
    }
  );

  dispatch(setVersionListener(unsubscribe));
};

// 🚪 Centralized logout
export const logOut = () => (dispatch: AppDispatch) => {
  dispatch(clearAgentListener());
  dispatch(clearVersionListener());
  dispatch(signOut());
  dispatch(resetAgentState());
  dispatch(resetKamState());
};

// 🕓 Session timeout (e.g., 60 min auto logout)
export const handleSessionTimeout = () => (dispatch: AppDispatch) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    dispatch(logOut());
  }, 60 * 60 * 1000); // 60 mins
};

// Action creators
export const { signIn, signOut, setVersion, setError } = authSlice.actions;

// Selectors (optional)
export const selectAuthVersion = (state: RootState) => state.auth.version;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
