import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import storageSession from 'redux-persist/lib/storage/session';

import authReducer from './authSlice';
import agentReducer from './agentSlice';
import requirementFormReducer from './listenerSlice';
import kamReducer from './kamSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  agent: agentReducer,
  requirementForm: requirementFormReducer,
  kam: kamReducer,
});

type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerType> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'agent'],
};

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // because of Firebase listeners (functions)
      immutableCheck: false, // Optional: disable immutable check for better performance
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
