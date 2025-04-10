// // store/slices/requirementSlice.ts
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '../../config/firebase';
// import { getUnixDateTime } from '../../helpers/getUnixDateTime';
// import { handleIdGeneration } from '../../helpers/nextId';
// import { showMessage } from 'react-native-flash-message'; // or another toast lib
// import { RootState } from '../store';

// type Budget = {
//   from: number | string;
//   to: number | string;
// };

// interface ErrorFields {
//   propertyName: string | null;
//   assetType: string | null;
//   configuration: string | null;
//   budget: string | null;
// }

// interface RequirementFormState {
//   requirementId: string;
//   agentCpid: string;
//   timestsamp: number;
//   propertyName: string;
//   requirementDetails: string;
//   assetType: string;
//   status: string;
//   added: number | null;
//   lastModified: number | null;
//   area: string;
//   configuration: string;
//   budgetFrom: string;
//   budgetTo: string;
//   marketValue: boolean;
//   error: ErrorFields;
//   isSubmitEnabled: boolean;
//   saving: boolean;
//   saveError: string | null;
// }

// const initialState: RequirementFormState = {
//   requirementId: 'RQ_A001',
//   agentCpid: '',
//   timestsamp: getUnixDateTime(),
//   propertyName: '',
//   requirementDetails: '',
//   assetType: '',
//   status: 'Pending',
//   added: null,
//   lastModified: null,
//   area: '',
//   configuration: '',
//   budgetFrom: '',
//   budgetTo: '',
//   marketValue: false,
//   error: {
//     propertyName: null,
//     assetType: null,
//     configuration: null,
//     budget: null,
//   },
//   isSubmitEnabled: false,
//   saving: false,
//   saveError: null,
// };

// const generateNextReqId = async () => {
//   try {
//     const type = 'lastReqId';
//     const { nextId } = await handleIdGeneration(type);
//     return nextId;
//   } catch (error) {
//     console.error('Error generating IDs:', error);
//     return null;
//   }
// };

// export const saveFormData = createAsyncThunk(
//   'requirementForm/saveFormData',
//   async (_, { rejectWithValue, getState }) => {
//     const nextReqId = await generateNextReqId();
//     if (!nextReqId) {
//       showMessage({
//         type: 'danger',
//         message: 'Failed to generate Requirement ID. Try again later.',
//       });
//       return;
//     }

//     try {
//       const state = (getState() as RootState).requirementForm;
//       const agentState = (getState() as RootState).agent;

//       const formData = {
//         requirementId: nextReqId,
//         agentCpid: agentState.docData?.cpId || '',
//         added: state.timestsamp,
//         lastModified: state.timestsamp,
//         status: state.status,
//         propertyName: state.propertyName,
//         requirementDetails: state.requirementDetails,
//         assetType: state.assetType,
//         area: parseFloat(state.area) || 0,
//         configuration: state.configuration,
//         budget: {
//           from: state.marketValue ? '' : parseFloat(state.budgetFrom) || 0,
//           to: state.marketValue ? '' : parseFloat(state.budgetTo) || 0,
//         },
//         marketValue: state.marketValue ? 'Market Value' : '',
//       };

//       const docRef = doc(db, 'requirements', nextReqId);
//       await setDoc(docRef, formData);

//       return { id: docRef.id, ...formData };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const requirementFormSlice = createSlice({
//   name: 'requirementForm',
//   initialState,
//   reducers: {
//     setField: (
//       state,
//       action: PayloadAction<{ field: keyof RequirementFormState; value: any }>
//     ) => {
//       const { field, value } = action.payload;
//       (state as any)[field] = value;

//       // Validation logic
//       if (field === 'propertyName') {
//         state.error.propertyName = value.trim() === '' ? 'Property Name is required' : null;
//       }

//       if (field === 'assetType') {
//         state.error.assetType = value === '' ? 'Asset Type is required' : null;
//         if (value === 'plot') {
//           state.error.configuration = null;
//         }
//       }

//       if (field === 'configuration') {
//         if (state.assetType !== 'plot' && value === '') {
//           state.error.configuration = 'Configuration is required';
//         } else {
//           state.error.configuration = null;
//         }
//       }

//       if (field === 'budgetFrom' || field === 'budgetTo') {
//         const from = parseFloat(state.budgetFrom) || 0;
//         const to = parseFloat(state.budgetTo) || 0;
//         state.error.budget = from >= 0 && to >= 0 && from <= to ? null : '';
//       }

//       if (field === 'marketValue' && value) {
//         state.error.budget = null;
//       }

//       state.isSubmitEnabled =
//         !state.error.propertyName &&
//         !state.error.assetType &&
//         !state.error.configuration &&
//         !state.error.budget &&
//         state.propertyName.trim() !== '' &&
//         state.assetType !== '' &&
//         state.budgetFrom.trim() !== '' &&
//         state.budgetTo.trim() !== '' &&
//         (state.assetType === 'plot' || state.configuration !== '');
//     },
//     resetForm: (state) => {
//       Object.assign(state, initialState);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(saveFormData.pending, (state) => {
//         state.saving = true;
//         state.saveError = null;
//       })
//       .addCase(saveFormData.fulfilled, (state) => {
//         state.saving = false;
//         Object.assign(state, initialState);
//       })
//       .addCase(saveFormData.rejected, (state, action) => {
//         state.saving = false;
//         state.saveError = action.payload as string;
//       });
//   },
// });

// export const { setField, resetForm } = requirementFormSlice.actions;
// export default requirementFormSlice.reducer;
