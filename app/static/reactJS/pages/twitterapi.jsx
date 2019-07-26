import React, { useState, useRef } from 'react';
import {
    Container, Row, Col,
    InputGroup, Input, Button
} from 'reactstrap';



const TwitterAPI = () => {
    const [tweet, setTweet] = useState('');
    const inputRef = useRef();

    const handleTwitterAPI = () => {
        let data = {'tweet': tweet};
        if (tweet !== '') {
            fetch('/api/twitter/tweet', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json()
            .then(response => {
                if (response === 'Tweet successfully posted!') {
                    setTweet('');
                    inputRef.current.value = '';
                    alert(response);
                } else {
                    setTweet('');
                    inputRef.current.value = '';
                    alert(response);
                };
            }));
        } else {
            alert('It\'s empty! Please type something to tweet it.')
        };
    };

    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', position: 'relative', background: 'linear-gradient(to right top, #555454, #594b4e, #59424e, #543b53, #46365b, #35365c, #21365b, #003658, #00354b, #0f323e, #1c2f32, #252a2a)'}}>
            <Container className="align-self-center">
                <Row className="justify-content-center my-5">
                    <Col md={10} lg={8} offset={{ md : 2, lg : 4}}>
                        <h2 style={{color: 'white', textAlign: 'center'}}>Tweet through Twitter's API</h2>
                    </Col>
                    <Col md={10} lg={8} offset={{ md : 2, lg : 4}}>
                        <h4 style={{color: 'white', textAlign: 'center'}}>(Administrators only but unlocked for everyone to test the feature as pleased)</h4>
                    </Col>
                </Row>
                <Row className="justify-content-center my-5">
                    <Col md={10} lg={6} offset={{ md : 2, lg : 6}} className="my-5">
                        <InputGroup>
                            <Input innerRef={inputRef} onChange={(e) => setTweet(e.target.value)} />
                            <Button color="primary" onClick={handleTwitterAPI}>Tweet</Button>
                        </InputGroup>
                    </Col>
                    <Col md={10} lg={8} offset={{ md : 2, lg : 4}}>
                        <p style={{color: 'white', textAlign: 'center'}}>Check out your tweet on our <a href="https://twitter.com/smallWo32181120" target="_blank">twitter</a></p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default TwitterAPI;