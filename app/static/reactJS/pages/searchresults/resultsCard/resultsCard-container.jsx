import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import ResultsCard from './resultsCard-present';


const ResultsCardContainer = (props) => {
    const [results, setResults] = useState(false);
    const [searchKey, setSearchKey] = useState(props.history.location.key ? props.history.location.key : false);
    const [searchInput, setSearchInput] = useState(props.searchInput ? props.searchInput : false);
    let inputRef = useRef();

    useEffect(() => {
        if (props.searchInput && props.history.location.key) {
            handleData();
        };
    }, []);

    useEffect(() => {
        if (props.searchInput !== searchInput && props.history.location.key !== searchKey) {
            handleData();
            setSearchKey(props.history.location.key);
            setSearchInput(props.searchInput);
        };
    });

    const handleInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleKeyUp = (e) => {
        if (e.keyCode === 13 && searchInput.length > 0) {
            handleData();
        };
    };

    const handleBlur = () => {
        setSearchInput(false);
        inputRef.current.value = '';
    };

    const handleData = () => {
        let searchJSON = { 'searchinput' : searchInput };

        fetch('/api/navbarsearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(searchJSON)
        })
        .then((res) => {
            res.json().then((response) => {
                if (response !== 'no results') {
                    setResults(response);
                    setSearchInput(false);
                    inputRef.current.value = '';
                } else {
                    setResults('no results');
                    setSearchInput(false);
                    inputRef.current.value = '';
                };
            });
        });
    };
    
    return <ResultsCard results={results}
                        ref={inputRef}
                        handleInput={handleInput}
                        handleKeyUp={handleKeyUp}
                        handleBlur={handleBlur} />
};


export default withRouter(ResultsCardContainer);