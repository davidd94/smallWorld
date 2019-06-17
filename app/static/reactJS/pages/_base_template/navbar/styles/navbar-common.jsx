import styled from 'styled-components';
import { NavLink } from 'react-router-dom';


const CustomNavbar = styled.div`
    background-color: #78C2AD;
`

const CustomNavItem = styled(NavLink)`
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    letter-spacing: 0;
    transition: 300ms all ease;
    text-decoration: none;

    :hover, :active {
        color: white;
        letter-spacing: 0.1rem;
        text-decoration: none;
    }
`;


export { CustomNavbar, CustomNavItem };