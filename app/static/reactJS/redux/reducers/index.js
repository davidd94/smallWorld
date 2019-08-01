import { combineReducers } from 'redux';

import counter from './redux-reducer';


const reduxReducers = combineReducers({
    counter,
});


export default reduxReducers;