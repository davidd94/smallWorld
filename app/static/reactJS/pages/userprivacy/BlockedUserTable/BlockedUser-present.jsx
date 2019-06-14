import React, { Component } from "react";
import styled from "styled-components";


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

    :before {
        content:"";
        position: absolute;
        width:100%;
        height:2.5rem;
        display: table;
        z-index: 10;
        background:rgb(170, 170, 170);
    }
`

const BlockedUserTitle = styled.div`
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
        return (
            <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 my-5">
                <ScrollWindowWrapper>
                    <h2 style={{textAlign: 'center'}}>Blocked Users</h2>
                    <ScrollWindow className="custom-scrollbar-s2">
                    <table style={{marginBottom: 0}} className="table table-striped table-hover user-list fixed-header">
                        <thead>
                            <tr>
                                <th style={{position: 'relative'}}><BlockedUserTitle>Avatar</BlockedUserTitle></th>
                                <th style={{position: 'relative'}}><BlockedUserTitle>User Name</BlockedUserTitle></th>
                                <th><div></div></th>
                            </tr>
                        </thead>
                        <tbody id="blockeduser-list">
                            {this.props.blockedUsers.map((user, index) => {
                                return (
                                    <tr key={index} className='userrow' id={user.username}>
                                        <td><AvatarStyle src={user.picture}></AvatarStyle></td>
                                        <td>{user.username}</td>
                                        <td className='text-right'>
                                            <a href={'/profile/' + user.username} target='_blank'><button className='button tiny'>View User</button></a>
                                            <button className='button alert tiny' 
                                                    style={{marginLeft: '1em'}} 
                                                    data-user={user.username} 
                                                    onClick={(e) => this.props.onClick(e, index)}>Unblock</button>
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

export default BlockedUserTable;