import { combineReducers } from 'redux';
import * as types from './types';

const INIT = {
  currentUser: null
}

function userStates(state=INIT, action) {
    switch(action.type) {
        case types.SET_USER_TYPE:
            return {
                ...state,
                currentUser: action.user
            }
        default:
            return state
    }
}

const ReducerCombined = combineReducers({
  userStates
});

export default ReducerCombined