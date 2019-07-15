import React from 'react';
import ReactQuill from 'react-quill';
import '../../../node_modules/react-quill/dist/quill.snow.css'
import {
    Container, Row, Col,
    InputGroup, Input, Button
} from 'reactstrap';

import styles from './_styles/newblogStyles.module';
import BGImg from '../../../images/homepage-background2.jpg';


const NewBlogPresent = (props) => {
    return (
        <div className={styles.newblogContainer} style={{backgroundImage: `url(${BGImg})`}}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={12} lg={8} offset={{ lg:4 }}>
                        <div className={styles.formContainer}>
                            <h2 className="mb-5" style={{textAlign: 'center'}}>Add New Blog Post</h2>
                            <InputGroup>
                                <Input type="text" name="title" placeholder="Blog title..." style={{width: '50%'}} onChange={props.handleInputs} />
                            </InputGroup>
                            <InputGroup className="my-3">
                                <ReactQuill onChange={props.handleTextBody}
                                            placeholder="Say something..."
                                            style={{width: '100%', height: '10rem', margin: '2rem 0'}} />
                            </InputGroup>
                            <InputGroup className="my-4">
                                <Input
                                    type="url"
                                    name="url"
                                    placeholder="image url..."
                                    onChange={props.handleInputs}
                                />
                            </InputGroup>
                            <div className="text-center">
                                <Button onClick={props.handleSubmit}>Submit</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default NewBlogPresent;