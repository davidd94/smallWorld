

export default reducer((state={ count: 0 }, action) => {
    if (action.type === 'INC') {
        console.log('INCREMENTING...');
        return {...state + action.payload}
    } else if (action.type === 'DEC') {
        console.log('INCREMENTING...')
        return {...state - action.payload}
    };

    return 'failed to increment...'
});