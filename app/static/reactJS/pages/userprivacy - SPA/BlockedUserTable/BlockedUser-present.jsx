import React, { Component } from "react";
import { Button } from 'reactstrap';
import styled from "styled-components";

import { PrivacyContext } from "../../../components/_context/UserContext";


const ScrollWindowWrapper = styled.div`
    position:relative;
    height: 100%;
    border-radius: 0.5em;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    :hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
`

const ScrollWindow = styled.div`
    height: 75vh;
    overflow: hidden;
    position: relative;
`

const BlockedUserTitle = styled.div`
    font-size: 1rem;
    position: absolute;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`

const AvatarStyle = styled.img`
    width: 4.5em;
    height: 4.5em;
    border-radius: 50%;
`


class BlockedUserTable extends Component {
    render() {
        let data = this.context.UsersBlocked;
        return (
            <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 my-5">
                <ScrollWindowWrapper>
                    <h2 style={{textAlign: 'center'}}>Blocked Users</h2>
                    <ScrollWindow className="custom-scrollbar-s2">
                    <table style={{marginBottom: 0, width: '100%'}}>
                        <thead>
                            <tr style={{height: '3rem'}}>
                                <th style={{position: 'relative'}}><BlockedUserTitle>Avatar</BlockedUserTitle></th>
                                <th style={{position: 'relative'}}><BlockedUserTitle>User Name</BlockedUserTitle></th>
                                <th style={{position: 'relative'}}><BlockedUserTitle>Actions</BlockedUserTitle></th>
                            </tr>
                        </thead>
                        <tbody id="blockeduser-list">
                            {data.map((user, index) => {
                                return (
                                    <tr key={index} className='userrow' id={user.username}>
                                        <td><AvatarStyle src={user.picture}></AvatarStyle></td>
                                        <td>{user.username}</td>
                                        <td className='text-center'>
                                            <a href={'/profile/' + user.username} target='_blank'><Button outline color="info" size="sm" className="my-1">View User</Button></a>
                                            <Button outline
                                                    className="my-1"
                                                    size="sm"
                                                    color="danger"
                                                    style={{marginLeft: '1em'}} 
                                                    data-user={user.username} 
                                                    onClick={(e) => this.props.onClick(e, index)}>Unblock</Button>
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    </ScrollWindow>
                </ScrollWindowWrapper>
            </div>
        )
    }
}


BlockedUserTable.contextType = PrivacyContext;


export default BlockedUserTable;