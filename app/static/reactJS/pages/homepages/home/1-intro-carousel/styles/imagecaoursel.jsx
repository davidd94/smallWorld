import styled from 'styled-components';
import { UncontrolledCarousel } from 'reactstrap';


const StyledCarousel = styled(UncontrolledCarousel)`
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 750px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    width: 50%;
    display: flex;
    align-content: center;

    @include media-breakpoint-down(lg){
        background-position: center center !important;
    }
`


export default StyledCarousel;