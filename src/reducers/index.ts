import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import { State } from '../types';

const reducers = combineReducers<State>({
  auth,
});

const logger = createLogger({ collapsed: true });
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default store;
