import styled from "styled-components"

export const Header = styled.div`
    width: 100%;
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1e4620;
    padding: 0px 3%;

    @media (max-width: 960px) {
        padding: 0px 3%;
    }
`

export const Links = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 30px;
    padding-right: 6%;

    @media (max-width: 1120px) {
        padding-right: 4%;
        gap: 30px;
    }
    @media (max-width: 960px) {
        padding-right: 2%;
        gap: 30px;
    }
    @media (max-width: 800px) {
        padding-right: 0%;
        gap: 30px;
    }
`

export const Title = styled.div`
    width: 20%;
    font-size: 30px;
    text-overflow: initial;
    color: white;
`;

export const RightContainer = styled.div`
    width: 10%;
    display:flex;
    gap: 30px;
    align-items:center;
    justify-content:end;
`;