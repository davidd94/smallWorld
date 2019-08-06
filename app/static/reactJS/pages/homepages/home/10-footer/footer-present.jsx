import React from 'react';
import {Container,
        Row,
        Col,
} from 'reactstrap';

import styles from './styles/footer.module';


const FooterSection = () => {
    return (
        <footer className={styles.ftcoFooter}>
            <Container>
                <Row style={{marginBottom: '2.5rem'}}>
                    <Col xs={12} lg={4} className={styles.footerWidget1}>
                        <h2 className={styles.footerHeading2}>About smallWorld</h2>
                        <p>A far far away land that you've never heard of before. Far from west of Westeros</p>
                        <ul className={styles.footerSocial}>
                            <li><a href='https://twitter.com/smallWo32181120' target="_blank"><i className='fab fa-twitter'></i></a></li>
                            <li><a href='#'><i className='fab fa-facebook-f'></i></a></li>
                            <li><a href='https://github.com/davidd94' target='_blank'><i className='fab fa-github'></i></a></li>
                            <li><a href='#'><i className='fab fa-instagram'></i></a></li>
                        </ul>
                    </Col>
                    <Col xs={12} lg={4} className={styles.footerWidget1} style={{paddingLeft: '3.5rem'}}>
                        <h2 className={styles.footerHeading2}>Links</h2>
                        <ul id={styles.footerLinks} className='list-unstyled'>
                            <li><i className='fas fa-long-arrow-alt-right' /><a href="#">Home</a></li>
                            <li><i className='fas fa-long-arrow-alt-right' /><a href="#">About</a></li>
                            <li><i className='fas fa-long-arrow-alt-right' /><a href="#">Services</a></li>
                            <li><i className='fas fa-long-arrow-alt-right' /><a href="#">Projects</a></li>
                            <li><i className='fas fa-long-arrow-alt-right' /><a href="#">Contact</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} lg={4} className={styles.footerWidget1}>
                        <h2 className={styles.footerHeading2}>Questions?</h2>
                        <div className={styles.block23}>
                            <ul id={styles.footerLinks} className='list-unstyled'>
                                <li><i className='fas fa-map-marker-alt' /><span className={styles.text}>5555 Mountain View, Suite 10, Los Angeles, California, USA</span></li>
                                <li><i className='fas fa-phone' /><span className={styles.text}>+1 818 305 5412</span></li>
                                <li><a href="#"><i className='fas fa-envelope' /><span className={styles.text}>info@yourdomain.com</span></a></li>
                                <li><a href="#"><i className='fas fa-comment-dots' /><span className={styles.text}>Send us a message</span></a></li>
                            </ul>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className={styles.footerPrivacy}>
                        <p>Copyright &copy;<script>document.write(new Date().getFullYear());</script> smallWorld, Inc. All rights reserved | <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};


export default FooterSection;