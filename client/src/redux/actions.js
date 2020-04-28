import * as types from './actionTypes';

export function setUserType(user_type) {
    return {
        type: types.SET_USER_TYPE,
        user_type: user_type
    }
}