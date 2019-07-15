import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Moment from 'react-moment';
import parse from 'html-react-parser';

import styles from './_styles/blogStyles.module';
import blogdefault from '../../../images/blogdefault.jpg';
import { AllBlogsContext } from '../../components/_context/BlogContext';


const BlogPresent = (props) => {
    let data = useContext(AllBlogsContext);
    
    const BlogImgPreview = (props) => {
        const AllImgPreviews = (props.blogs).map((blog, index) => {
            return <figure key={`index-${index}`}
                            className={([styles.absoluteBg, styles.previewImg]).join(' ')}
                            style={{backgroundImage : (blog.url == '' ? `url(${blogdefault})` : `url(${blog.url})`), visibility: (props.imgIndex == index ? 'visible' : 'hidden')}} />
        });

        return AllImgPreviews;
    };

    const BlogPosts = (props) => {
        const AllBlogs = (props.blogs).map((blog, index) => {
            return (
                <li className={styles.preview} onMouseOver={() => {props.handleImgIndex(index)}} key={`index-${index}`}>
                    <a className={styles.previewLink} href="#" onClick={() => {props.handleBlogView(parseInt(blog.id))}}>
                        <Moment className={styles.previewDate}
                                date={blog.timestamp}
                                format="MMM D YYYY"
                                interval={0} />
                        <h2 className={styles.previewHeader}>{blog.title}</h2>
                        <div className={styles.previewExcerpt}>{parse(blog.body)}</div>
                        <span className={styles.previewMore}>Read More</span>
                    </a>
                </li>
            );
        });

        return AllBlogs;
    };

    const BlogPostPreview = (props) => {
        const AllBlogs = (props.blogs).map((blog, index) => {
            return (
                <div className={styles.blogView} key={`index-${index}`} style={props.blogID == blog.id ? {visibility: 'visible', opacity: 1, display: 'block'} : {}}>
                    <p onClick={props.handleBlogView} className={styles.closeBtn}>CLOSE</p>
                    <p className={styles.blogViewTitle}>{blog.title}</p>
                    <p className={styles.blogViewAuthor}>by {blog.username} | <Moment className={styles.previewDate} date={blog.timestamp} format="MMM D YYYY" interval={0} /></p>
                    
                    <div className={styles.blogViewBody}>
                        <PerfectScrollbar>
                        <div style={{padding: '1rem'}}>{parse(blog.body)}</div>
                        </PerfectScrollbar>
                    </div>
                    
                </div>
            );
        });

        return AllBlogs;
    };

    return (
        <div className={styles.blogContainer}>
        <section className={([styles.section, styles.previews]).join(' ')}>
            <div>
                <BlogImgPreview blogs={data.BlogPosts}
                                imgIndex={props.imgIndex} />
            </div>
            <div>
                <div className={([styles.active]).join(' ')}>
                        <ul style={props.blogPreview ? {height: '100vh', overflow: 'hidden'} : {}}> 
                            <BlogPosts blogs={data.BlogPosts}
                                        handleImgIndex={props.handleImgIndex}
                                        handleBlogView={props.handleBlogView} />
                        </ul>
                        <footer className={([styles.sectionPaddingSM, styles.footer]).join(' ')} style={props.blogPreview ? {display: 'none'} : {}}>
                            <NavLink className={styles.footerArchive} to={props.admin ? "/reactdev-blog/new" : "/reactdev-home"} style={props.admin ? {visibility: 'visible'} : {visibility: 'hidden'}}>New Blog Post</NavLink>
                            <ul className={styles.footerSocial}>
                                <li><a href="mailto:smallworld949@gmail.com"><i className={([styles.footerIcon, "far fa-envelope"]).join(' ')} /></a></li>
                                <li><a href="https://github.com/davidd94" target="_blank"><i className={([styles.footerIcon, "fab fa-github"]).join(' ')} /></a></li>
                                <li><a href="https://www.linkedin.com/in/duong-david-3b451aa2/" target="_blank"><i className={([styles.footerIcon, "fab fa-linkedin-in"]).join(' ')} /></a></li>
                            </ul>
                        </footer>
                        <div className={styles.blogViewContainer} style={props.blogPreview ? {visibility: 'visible', opacity: 1} : {}}>
                            <BlogPostPreview blogs={data.BlogPosts}
                                                handleBlogView={props.handleBlogView}
                                                blogID={props.blogID} />
                        </div>
                </div>
            </div>
        </section>
        </div>
    );
};


export default BlogPresent;