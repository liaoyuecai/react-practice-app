import { Map } from 'immutable';
import { put, call } from 'redux-saga/effects';
import { takeEvery, takeLatest } from 'redux-saga';

// action

// reducer
const defaultState = Map();

const homeReducers = (state=defaultState, action) => {
  switch (action.type) {
    default:
      return state
  }
};

export default {
  homeReducers
}