import { useContext } from "react";

import { UserContext } from "../../Context/user.jsx";

import Nav from "./Components/Nav/index.jsx";
import StyledLink from "../StyledLink";

export default function NavBar()
{
    const { currentUser } = useContext(UserContext);    
    return (
        <>
            {   currentUser === null ? <></> 
            
                : currentUser.role === "Editor" | currentUser.role === "User" ?
                <Nav>
                    <StyledLink to="/molds" text={"Moldes"}></StyledLink>
                    <StyledLink to="/molds" text={"Peças"}></StyledLink>
                    <StyledLink to="/molds" text={"Materiais"}></StyledLink>
                    <StyledLink to="/molds" text={"Operações"}></StyledLink>
                </Nav>
            
            
                : currentUser.role === "Admin" ?
                <Nav>
                    <StyledLink to="/molds" text={"Moldes"}></StyledLink>
                    <StyledLink to="/parts" text={"Peças"}></StyledLink>
                    <StyledLink to="/operation" text={"Operações"}></StyledLink>
                    <StyledLink to="/material" text={"Materiais"}></StyledLink>
                    <StyledLink to="/molds" text={"Usuários"}></StyledLink>
                    <StyledLink to="/molds" text={"Clientes"}></StyledLink>
                    <StyledLink to="/molds" text={"Maquinas"}></StyledLink>
                </Nav>
                :<></>
            }
        </>
    )
}