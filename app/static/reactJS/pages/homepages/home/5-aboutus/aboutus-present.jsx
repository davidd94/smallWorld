import React from 'react';
import {Container,
        Row,
        Col,

} from 'reactstrap';

import styles from './styles/aboutus.module';


const AboutCard = (props) => {
    return (
        <Col xs={12} lg={12}>
            <div className={styles.staff}>
                <div className={styles.imgWrap}>
                    <div className={styles.img}></div>
                </div>
                <div className={styles.text}>
                    <div>
                        <h3>{props.fullname}</h3>
                        <span className={styles.position}>{props.title}, {props.position}</span>
                        <div className={styles.faded}>
                            <ul className={styles.ftcoSocial}>
                                <li><a href='#'><i className='fab fa-twitter'></i></a></li>
                                <li><a href='#'><i className='fab fa-facebook-f'></i></a></li>
                                <li><a href='https://github.com/davidd94' target='_blank'><i className='fab fa-github'></i></a></li>
                                <li><a href='#'><i className='fab fa-instagram'></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    );
};

const AboutUs = () => {
    return (
        <section className={styles.ftcoSection}>
            <Container>
                <Row style={{textAlign: 'center', paddingBottom: '4rem'}}>
                    <Col xs={12}>
                        <span className={styles.subheading}>About Me</span>
                        <h2 className={styles.heading}>Our Staff</h2>
                        <p className={styles.aboutText}>I have entwined my two passions, programming and nature thus creation of smallWorld. The purpose is to allow myself and others share their creative work that ranges from a simple small terrarium to a complex reptile/amphibian ecosystem. It's a place where like-minded hobbyist can chat with each other or just explore into each other's small worlds.</p>
                    </Col>
                </Row>
                <Row>
                    <AboutCard fullname='David Duong' title='Full Stack Developer' position='Founder' />
                </Row>
            </Container>
        </section>
    );
};


export default AboutUs;