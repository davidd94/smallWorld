
const incrementNum = () => {
    return {
        type: 'INC',
        payload: 1
    };
};

const decrementNum = () => {
    return {
        type: 'DEC',
        payload: 1
    };
};


export { incrementNum, decrementNum };