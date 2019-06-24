import React from 'react';
import {Container,
        Row,
        Col,
        Nav,
        NavItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import styles from './styles/sitedetails.module';


const ListItem = React.forwardRef((props, ref) => {
    return (
        <NavItem style={{marginBottom: 0, width: '100%'}} onClick={props.onClick}>
            <NavLink to={props.href} exact className={styles.navLink} activeClassName={styles.active}><span ref={ref}><i className={props.icon} />{props.listText}</span></NavLink>
        </NavItem>
    );
});

const TabPanel = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className={styles.tabPanel}>
            <span className={styles.panelClose} onClick={props.onClose}>Close</span>
            <i className={props.icon} />
            <h2>{props.title}</h2>
            <p>{props.detail1}</p>
            <p>{props.detail2}</p>
        </div>
    );
});

const DetailBox = React.forwardRef((props, ref) => {
    const { ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10 } = ref;

    return (
        <section className={styles.ftcoServices}>
            <Container>
                <Row className='no-gutters'>
                    <Col xs={12} md={4} className={styles.navLinkWrap}>
                        <Nav pills className={styles.navPills}>
                            <ListItem href='#' icon='fas fa-inbox' listText='Private Messages' onClick={props.onClick} ref={ref6} />
                            <ListItem href='#' icon='fas fa-bell' listText='Notification System' onClick={props.onClick} ref={ref7} />
                            <ListItem href='#' icon='fas fa-comments' listText='Live Chat System' onClick={props.onClick} ref={ref8} />
                            <ListItem href='#' icon='fas fa-lightbulb' listText='Detailed Projects' onClick={props.onClick} ref={ref9} />
                            <ListItem href='#' icon='fas fa-thumbs-up' listText='Social System' onClick={props.onClick} ref={ref10} />
                        </Nav>
                    </Col>
                    <Col xs={12} md={8} className={styles.tabBox}>
                        <div className={styles.tabContent}>
                            <TabPanel icon='fas fa-inbox' title='Private Messages' 
                                        detail1='Fully functional private message with delete, reply and recover features! Free users have unlimited messages.'
                                        detail2="Additionally, blocked users will automatically blocked all incoming private messages. We're soon to implement gifs and images along with sent messages! Stay tuned!"
                                        ref={ref1}
                                        className={styles.active}
                                        onClose={props.onClose} />
                            <TabPanel icon='fas fa-bell' title='Notification System' 
                                        detail1='An alert system that uses long-polling technique every 10 seconds to fetch all notifications for private/chat messages and comments/replies.'
                                        detail2="What to look for in the future.. notification changing to a server sent event system which will be much more responsive and use less resources."
                                        ref={ref2}
                                        onClose={props.onClose} />
                            <TabPanel icon='fas fa-comments' title='Live Chat System' 
                                        detail1="A responsive chat system using websockets that contains its very own mini notifiction within the chatlist for unread messages. Only users who follow each other are automatically added to each other's chat list."
                                        detail2="Caching online user data on Redis will be implemented in the near future. At this moment, it is temporarily cached in each user's server session file (not cookies)."
                                        ref={ref3}
                                        onClose={props.onClose} />
                            <TabPanel icon='fas fa-lightbulb' title='Complete Project Manual' 
                                        detail1='Each individual projects will have complete information about the setup. There is a tutorial, maintenance, item list (with cost), FAQs and photo gallery section.'
                                        detail2="An interactive photo will be implemented which should allow users to get a complete view of the setup as well as the ability to highlight each item's and creature information in a popover window."
                                        ref={ref4}
                                        onClose={props.onClose} />
                            <TabPanel icon='fas fa-thumbs-up' title='Social System' 
                                        detail1='The basic social system includes a block, follow, comment, reply, and like systems. Simple algorithm will determine which are the top 10 trending or popular projects.'
                                        detail2="Additionally, two search engine types are implemented using Elasticsearch. One is to search for projects and its details and another for project tags."
                                        ref={ref5}
                                        onClose={props.onClose} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
});


export default DetailBox;