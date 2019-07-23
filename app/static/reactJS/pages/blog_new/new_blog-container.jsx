import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import NewBlogPresent from './new_blog-present';



const NewBlogContainer = () => {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAdminStatus = async () => {
            const token = localStorage.getItem('token');
            return await fetch('/api/admincheck', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json()
            .then(response => {
                if (response == 'You have admin access to this page') {
                    setLoading(false);
                    setAdmin(true);
                } else {
                    setAdmin(false);
                    setLoading('unauthorized');
                };
            }));
        };

        fetchAdminStatus();

    }, []);

    const handleInputs = (e) => {
        if (e.target.name == 'title') {
            setTitle(e.target.value);
        } else if (e.target.name == 'url') {
            setUrl(e.target.value);
        };
    };
    
    const handleTextBody = (content, delta, source, editor) => {
        setText(content);
    };
    
    const handleSubmit = () => {
        if (title !== '' &&
            text !== '' &&
            url !== '' &&
            admin) {
            
            let data = {'title': title,
                        'text': text,
                        'url': url};
            let token = localStorage.getItem('token') ? localStorage.getItem('token') : '';

            fetch('/api/newblog', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            .then((res) => {
                res.json().then((response) => {
                    if (response == 'saved blog post!') {
                        window.location.href = '/reactdev-blog';
                    } else {
                        window.location.href = '/reactdev-home';
                    };
                });
            });
        };
    };

    if (admin == false && loading == true) {
        return <div>loading admin blog page...</div>
    } else if (admin == false && loading == 'unauthorized') {
        return <Redirect to='/reactdev-home' />
    } else if (admin == true && loading == false) {
        return <NewBlogPresent 
            setTitle={setTitle}
            setText={setText}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            handleInputs={handleInputs}
            handleTextBody={handleTextBody}
            />
    } else {
        return <div>There was an error authorizing user...</div>
    };
};


export default NewBlogContainer;