// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistPartial } from 'redux-persist/es/persistReducer';

import authReducer from './slices/authSlice';
import agentReducer from './slices/agentSlice';
import kamReducer from './slices/kamSlice';
import listenerReducer from './slices/listenerSlice';
import propertyReducer from './slices/propertySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  agent: agentReducer,
  kam: kamReducer,
  listeners: listenerReducer,
  property: propertyReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ["auth", "agent"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

type NonPersistedRootState = ReturnType<typeof rootReducer>;

export type RootState = NonPersistedRootState & PersistPartial;

export type AppDispatch = typeof store.dispatch;
