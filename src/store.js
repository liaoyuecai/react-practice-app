import { createStore, applyMiddleware  } from 'redux';
import { Map } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux-immutable';
import reducers from './redux';

// 组装reducer
const allReducers = {};

for (const k in reducers) {
  const model =  reducers[k];
  const reducerReg = /(.*)Reducers$/;
  for (const m in model) {
    if (reducerReg.test(m)) {
      allReducers[m] = model[m];
    }
  }
}

const initialState = Map();

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers(allReducers),
    initialState,
    applyMiddleware(sagaMiddleware)
);

// 组装saga
for (const k in reducers) {
  const model =  reducers[k];
  const sagaReg = /(.*)Saga$/;
  for (const m in model) {
    if (sagaReg.test(m)) {
      sagaMiddleware.run(model[m]);
    }
  }
}

export default store;