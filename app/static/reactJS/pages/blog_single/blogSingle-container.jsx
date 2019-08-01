import React, { useState } from 'react';

import BlogSinglePresent from './blogSingle-present';
import QueryBlogInfo from '../../components/_queryinfo/blogInfo';


const BlogSingleContainer = (props) => {
    const [blogID, setBlogID] = useState(props.match.params.id);
    
    return (
        <QueryBlogInfo type='single' blogID={blogID} >
            <BlogSinglePresent />
        </QueryBlogInfo>
    );
};


export default BlogSingleContainer;