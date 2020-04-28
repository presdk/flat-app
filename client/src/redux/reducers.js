import { combineReducers } from 'redux';
import * as types from './actionTypes';

const INIT = {
  user_type: null
}

function userStates(state=INIT, action) {
    switch(action.type) {
        case types.SET_USER_TYPE:
            return {
                ...state,
                user_type: action.user_type
            }
        default:
            return state
    }
}

const ReducerCombined = combineReducers({
  userStates
});

export default ReducerCombined