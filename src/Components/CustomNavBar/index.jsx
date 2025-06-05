import { Header, NavContainer, Title, Menu, MenuItem, Dropdown, DropdownToggle, DropdownMenu, RightContainer } from "./style.jsx";
import ProfileAvatar from '../ProfileAvatar/index.jsx';
import { useState, useEffect, useRef } from "react";

export default function CustomNavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();

  const handleDropdownToggle = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Header>
      <Title>Simoldes</Title>

      <NavContainer ref={dropdownRef}>
        <Menu>
          <Dropdown>
            <DropdownToggle onClick={() => handleDropdownToggle("producao")} aria-expanded={openDropdown === "producao"}>
              Produção
            </DropdownToggle>
            {openDropdown === "producao" && (
              <DropdownMenu>
                <MenuItem to={"/molds"}>Moldes</MenuItem>
                <MenuItem to={"/parts"}>Peças</MenuItem>
                <MenuItem to={"/materials"}>Materiais</MenuItem>
                <MenuItem to={"/operations"}>Operações</MenuItem>
                <MenuItem to={"/parts"}>Máquinas</MenuItem>
              </DropdownMenu>
            )}
          </Dropdown>

          <Dropdown>
            <DropdownToggle onClick={() => handleDropdownToggle("gestao")} aria-expanded={openDropdown === "gestao"}>
              Gestão
            </DropdownToggle>
            {openDropdown === "gestao" && (
              <DropdownMenu>
                <MenuItem to={"/parts"}>Clientes</MenuItem>
                <MenuItem to={"/parts"}>Usuários</MenuItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </Menu>
      </NavContainer>

      <RightContainer>
        <ProfileAvatar />
      </RightContainer>
    </Header>
  );
}
