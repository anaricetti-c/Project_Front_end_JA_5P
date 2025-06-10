import {
  Header,
  NavContainer,
  Title,
  Menu,
  MenuItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  RightContainer,
} from "./style.jsx";
import ProfileAvatar from "../ProfileAvatar/index.jsx";
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

  const handleMenuItemClick = () => {
    setOpenDropdown(null);
  };

  return (
    <Header>
      <Title>Simoldes</Title>

      <NavContainer ref={dropdownRef}>
        <Menu>
          <Dropdown>
            <DropdownToggle
              onClick={() => handleDropdownToggle("producao")}
              aria-expanded={openDropdown === "producao"}
            >
              Produção
            </DropdownToggle>
            {openDropdown === "producao" && (
              <DropdownMenu>
                <MenuItem to="/molds" onClick={handleMenuItemClick}>
                  Moldes
                </MenuItem>
                <MenuItem to="/parts" onClick={handleMenuItemClick}>
                  Peças
                </MenuItem>
                <MenuItem to="/materials" onClick={handleMenuItemClick}>
                  Materiais
                </MenuItem>
                <MenuItem to="/operations" onClick={handleMenuItemClick}>
                  Operações
                </MenuItem>
                <MenuItem to="/machines" onClick={handleMenuItemClick}>
                  Máquinas
                </MenuItem>
              </DropdownMenu>
            )}
          </Dropdown>

          <Dropdown>
            <DropdownToggle
              onClick={() => handleDropdownToggle("gestao")}
              aria-expanded={openDropdown === "gestao"}
            >
              Gestão
            </DropdownToggle>
            {openDropdown === "gestao" && (
              <DropdownMenu>
                <MenuItem to="/customers" onClick={handleMenuItemClick}>
                  Customers
                </MenuItem>
                <MenuItem to="/users" onClick={handleMenuItemClick}>
                  Usuários
                </MenuItem>
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
