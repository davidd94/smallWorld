import { createStore } from 'redux';

import reduxReducer from './reducers/index';

import { incrementNum, decrementNum } from './actions/incrementActions';


const reduxStore = createStore(reduxReducer, 0);


reduxStore.subscribe(() => {
    console.log('store changed', reduxStore.getState())
});


reduxStore.dispatch(incrementNum);


export default reduxStore;