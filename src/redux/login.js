import { Map } from 'immutable';
import { put, call } from 'redux-saga/effects';
import { takeEvery, takeLatest } from 'redux-saga';

// action
const LOGIN_ACTION = { type: 'LOGIN_ACTION' };

// reducer
const defaultState = Map({ logined: false });

const loginReducers = (state=defaultState, action) => {
  switch (action.type) {
    case LOGIN_ACTION.type:
      return state.set('logined', true);
    default:
      return state;
  }
};

// saga
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* loginRequest() {
  console.log('登录请求');
  yield call(delay, 1000);
  yield put({ type: 'LOGIN_ACTION' });
}

function* loginSaga() {
  // 开始登录
  yield* takeEvery("LOGIN_REQUEST", loginRequest);
}

// 导出
export default {
  loginReducers,
  loginSaga
}

