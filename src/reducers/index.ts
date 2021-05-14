import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import auth from './auth';
import server from './server';
import { State } from '../types';

const reducers = combineReducers<State>({
  auth,
  server,
});

const logger = createLogger({ collapsed: true });
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default store;