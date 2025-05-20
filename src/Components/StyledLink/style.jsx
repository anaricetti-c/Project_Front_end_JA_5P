
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SLink = styled(Link)`
    color: ${(props) => props.color || 'white'};
    text-decoration: none;
    font-size: 18px;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        width: 0%;
        height: 1px;
        display: block;
        transition: all 0.3s ease;
        bottom: 0; 
        left: 0; 
        background-color:${(props) => props.color || 'white'};; 
    }

    &:hover::after {
        width: 100%; 
    }
`;