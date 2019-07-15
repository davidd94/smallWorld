import React from 'react';
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
                            <InputGroup className="my-5">
                                <Input type="textarea" name="bodytext" style={{height: '12rem'}} placeholder="Say something..." onChange={props.handleInputs} />
                            </InputGroup>
                            <InputGroup className="my-5">
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