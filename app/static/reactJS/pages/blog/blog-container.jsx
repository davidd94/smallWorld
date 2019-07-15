import React, { useState, useEffect } from 'react';

import BlogPresent from './blog-present';
import QueryBlogInfo from '../../components/_queryinfo/blogInfo';


const BlogContainer = () => {

    const [imageIndex, setImgIndex] = useState(0);
    const [blogID, setBlogID] = useState('');
    const [admin, setAdmin] = useState(false);
    const [blogPreview, setBlogPreview] = useState(false);
    
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

    return (
        <QueryBlogInfo type="all">
            <BlogPresent imgIndex={imageIndex}
                        handleImgIndex={handleImgIndex}
                        handleBlogView={handleBlogView}
                        blogPreview={blogPreview}
                        admin={admin}
                        blogID={blogID}
                         />
        </QueryBlogInfo>
    );
};


export default BlogContainer;