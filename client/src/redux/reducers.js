import { combineReducers } from 'redux';
import * as types from './types';

const INIT = {
  user: null
}

function userStates(state=INIT, action) {
    switch(action.type) {
        case types.SET_USER_TYPE:
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}

const ReducerCombined = combineReducers({
  userStates
});

export default ReducerCombined