import { createStore } from 'redux';

import ReducerCombined from './reducers'

const store = createStore(
    ReducerCombined,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store