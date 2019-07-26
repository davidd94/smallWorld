import React, { useState, useEffect } from 'react';

import BlogPresent from './blog-present';
import QueryBlogInfo from '../../components/_queryinfo/blogInfo';


const BlogContainer = () => {
    const [imageIndex, setImgIndex] = useState(0);
    const [blogID, setBlogID] = useState('');
    const [admin, setAdmin] = useState(false);
    const [blogPreview, setBlogPreview] = useState(false);
    const [blogPage, setBlogPage] = useState(1);
    
    useEffect(() => {
        let token = localStorage.getItem('token');
        fetch('/api/admincheck', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            res.json().then((response) => {
                if (response == 'You have admin access to this page') {
                    setAdmin(true);
                } else {
                    setAdmin(false);
                };
            });
        });
    }, []);

    const handleImgIndex = (index) => {
        setImgIndex(index);
    };

    const handleBlogView = (id) => {
        setBlogID(id);
        setBlogPreview(!blogPreview);
    };

    const handlePagination = (direction) => {
        direction == 'next' ? setBlogPage(blogPage + 1) : setBlogPage(blogPage - 1);
    };

    return (
        <QueryBlogInfo type="all" blogPage={blogPage}>
            <BlogPresent imgIndex={imageIndex}
                        handleImgIndex={handleImgIndex}
                        handleBlogView={handleBlogView}
                        blogPreview={blogPreview}
                        admin={admin}
                        blogID={blogID}
                        blogPage={blogPage}
                        setBlogPage={setBlogPage}
                        handlePagination={handlePagination}
                         />
        </QueryBlogInfo>
    );
};


export default BlogContainer;