import styled, { keyframes } from "styled-components";
import { Link } from 'react-router-dom';

const mainGreen = "#2f5936";
const mainGreenHover = "#264b2d";

const dropdownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Header = styled.header`
  width: 100%;
  height: 8vh;
  background-color: ${mainGreen};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: white;
`;

export const NavContainer = styled.nav`
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-left: 40px;
`;

export const Menu = styled.ul`
  display: flex;
  align-items: center;
  gap: 15px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Dropdown = styled.li`
  position: relative;
  margin: 0;
`;

export const DropdownToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 12px;
  transition: background-color 0.3s ease;

  display: flex;
  align-items: center;
  height: 100%;

  &:hover,
  &:focus {
    background-color: ${mainGreenHover};
    outline: none;
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 220px;
  background-color: ${mainGreen};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  z-index: 1000;
  animation: ${dropdownAnimation} 0.2s ease-out;
  border-radius: 0;
  list-style: none;
`;

export const MenuItem = styled(Link)`
  display: block;
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: ${mainGreenHover};
  }
`;

export const RightContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20px;
`;
