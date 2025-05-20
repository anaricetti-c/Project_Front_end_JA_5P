import { SLink } from "./style.jsx";

export default function StyledLink({ to,  text, color = "white"})
{
    return <SLink to={to} color={color}>{text}</SLink>
}