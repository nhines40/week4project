// public/store.js
import { configureStore, combineReducers } from 'redux';

const rootReducer = combineReducers({
  // Add reducers here
});

const store = configureStore(rootReducer);

export default store;