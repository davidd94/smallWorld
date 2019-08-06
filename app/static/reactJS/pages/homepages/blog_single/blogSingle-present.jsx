import React, { useContext } from 'react';
import {Container, Row, Col} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Moment from 'react-moment';
import parse from 'html-react-parser';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { AllBlogsContext } from '../../../components/_context/BlogContext';
import BGImg from '../../../../images/aboutme-bio.jpg';


const BlogSinglePresent = () => {
    let data = useContext(AllBlogsContext);
    let blog = data.BlogPosts[0];
    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', alignItems: 'center', padding: '1rem', backgroundImage: `url(${BGImg})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat'}}>
            <Container style={{overflow: 'hidden', height: '80%'}}>
                <Row className="justify-content-center" style={{overflow: 'hidden', height: '100%'}}>
                    <Col md={12} lg={8} offset={{ lg: 4 }} style={{backgroundColor: '#ecd69f', padding: '1rem', borderRadius: '0.5rem', overflow: 'hidden', height: '100%'}}>
                        <h2>{blog.title} <NavLink to="/reactdev-blog" style={{color: 'red', float: 'right', fontSize: '0.85rem'}}>Back to blogs</NavLink></h2>
                        <p>by <span> {blog.username}</span> | <Moment date={blog.timestamp}
                                                        format="MMM D YYYY"
                                                        interval={0} />
                        </p>
                        <div style={{overflow: 'hidden', height: '80%', opacity: 0.8}}>
                            <PerfectScrollbar>
                                {parse(blog.body)}
                            </PerfectScrollbar>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default BlogSinglePresent;