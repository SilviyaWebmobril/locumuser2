/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import AppRoutes from './src/Routes/AppRoutes';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import register_reducer from './src/redux/stores/reducers/register_reducer';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-community/async-storage';
import auth_store from './src/redux/stores/reducers/auth_store';
import search_job_store from './src/redux/stores/reducers/search_job_store';
import transactions_store from './src/redux/stores/reducers/transactions_store';
import packages_coupon_store from './src/redux/stores/reducers/packages_coupon_store';

const reducer = combineReducers({

  register : register_reducer,
  auth : auth_store,
  search_job : search_job_store,
  transactions : transactions_store,
  packages_and_coupons : packages_coupon_store,


});

const persistConfig = {
  key: 'STORE_USER_ID_GLOBALLY',
  storage: AsyncStorage,
  whitelist: ['auth','register',] ,// which reducer want to store
  blacklist : ['search_job','transactions','packages_and_coupons']
};
const pReducer = persistReducer(persistConfig, reducer);

const store = createStore(pReducer,undefined,applyMiddleware(ReduxThunk));

const persistor = persistStore(store);



const App = () => {
  return (
  <Provider store={store}>
    <PersistGate persistor={persistor} >
    <AppRoutes />
    </PersistGate>
  </Provider>
   
  );
};



export default App;
