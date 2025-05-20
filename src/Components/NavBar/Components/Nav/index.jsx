import { Header, Links, Title, RightContainer } from "./style.jsx";
import ProfileAvatar from '../../../ProfileAvatar';

export default function NavBar({ children })
{
    return (
        <Header>
            <Title>Simoldes</Title>
            <Links>
                {children}
            </Links>
            <RightContainer>
                <ProfileAvatar/>
            </RightContainer>
        </Header>
    )
}