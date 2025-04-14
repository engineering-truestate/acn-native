// store/slices/kamSlice.ts
import { createSlice, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../app/config/firebase';
import { RootState } from '../store';

export const setKamDataState = (kamId: string): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  AnyAction
> => async (dispatch, getState) => {
  const { kamId: currentKamId } = getState().kam;
  if (currentKamId === kamId) return;

  // First, set loading
  dispatch(setLoading(true));
  dispatch(resetError());
  
  try {
    const q = query(collection(db, 'kam'), where('kamId', '==', kamId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const { myAgents, ...docDataWithoutAgents } = docSnap.data();
      const data = {
        docData: docDataWithoutAgents,
        docId: docSnap.id,
      };
      
      // Update the state with the new data
      dispatch(setKamId(kamId));
      dispatch(setKamDoc(data));
      console.log("yippieeee")
    } else {
      throw new Error('No user found with this phone number.');
    }
  } catch (error: any) {
    console.log(error.message)
    dispatch(setError(error.message));
  } finally {
    // Set loading to false
    dispatch(setLoading(false));
  }
};

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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
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
    resetError: (state) => {
      state.error = null;
    }
  },
  // Remove extraReducers since we're not using createAsyncThunk anymore
});

export const {
  setLoading,
  setKamId,
  setKamDoc,
  resetKamState,
  setError,
  resetError,
} = kamSlice.actions;

export const selectKamState = (state: any) => state?.kam;
export const selectKamName = (state: any) => state?.kam?.kamDocData?.name || '';
export const selectKamNumber = (state: any) => state?.kam?.kamDocData?.phonenumber || '';

export default kamSlice.reducer;