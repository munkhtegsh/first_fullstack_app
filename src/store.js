import { createStore, applyMiddleware } from 'redux';
import reducer from './ducks/user';
import promiseMiddleWare from 'redux-promise-middleware';

const middleWare = applyMiddleware(promiseMiddleWare());
export default createStore(reducer, middleWare);
