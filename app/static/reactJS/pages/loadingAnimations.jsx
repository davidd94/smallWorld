import React from 'react';
import ReactLoading from 'react-loading';


const LoadingDisplay = (type, color) => (
    <div style={{width: '100%', height: '100vh', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
        <ReactLoading type={type} color={color} />
    </div>
);


export default LoadingDisplay;