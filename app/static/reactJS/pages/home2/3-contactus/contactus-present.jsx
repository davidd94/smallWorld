import React from 'react';
import {Container,
        Row,
        Col,
} from 'reactstrap';

import styles from './styles/contactus.module';


const ContactCard = (props) => {
    return (
        <>
        <Col md={6} lg={3}>
            <div className={styles.cardBox}>
                <div className={styles.icon}>
                    <i className={props.icon} />
                </div>
                <h3>{props.header}</h3>
                <p>{props.text}</p>
            </div>
        </Col>
        </>
    );
};

const ContactSection = () => {
    return (
        <footer className={styles.ftcoSection}>
            <Container>
                <Row style={{textAlign: 'center'}}>
                    <Col xs={12}>
                        <span className={styles.subheading}>Contact</span>
                        <h2 className={styles.heading}>Contact Us</h2>
                        <p className={styles.contactText}>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia</p>
                    </Col>
                </Row>
                <Row style={{marginBottom: '2rem'}}>
                    <ContactCard icon={'fas fa-map-pin'} header={'ADDRESS'} text={'5555 Mountain View, Suite 10 Los Angeles, CA 91335'} />
                    <ContactCard icon={'fas fa-phone-alt'} header={'CONTACT NUMBER'} text={'+ 1555 555 5555'} />
                    <ContactCard icon={'far fa-paper-plane'} header={'EMAIL ADDRESS'} text={'smallWorld949@gmail.com'} />
                    <ContactCard icon={'fab fa-github'} header={'GITHUB'} text={'https://github.com/ davidd94/smallWorld'} />
                </Row>
            </Container>
        </footer>
    );
};


export default ContactSection;