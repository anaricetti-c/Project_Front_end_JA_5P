import { UserContext } from "../../Context/user";

import { useContext, useState } from "react";
import { Avatar, ListItemIcon, Menu, MenuItem, Skeleton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Logout } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";

export default function ProfileAvatar() {
  const { currentUser, userLogout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    navigate("/profile", { state: { user: currentUser } });
  };

  const handleLogout = () => {
    setAnchorEl(null);
    userLogout();
    navigate("/");
  };

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let lightColor = "#";
    let darkColor = "#";

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;

      // Versão clara: aproxima o valor de 255 (branco)
      const lightValue = Math.floor((value + 255) / 2);
      lightColor += `0${lightValue.toString(16)}`.slice(-2);

      // Versão escura: aproxima de 0 (preto)
      const darkValue = Math.floor(value / 2);
      darkColor += `0${darkValue.toString(16)}`.slice(-2);
    }

    return [lightColor, darkColor];
  }

  function stringAvatar(name) {
    const [lightBg, darkBg] = stringToColor(name)
    return {
      sx: {
        bgcolor: lightBg,
        color: darkBg,
        fontSize: '15px',
      },
      children: name.includes(" ")
        ? `${name.split(" ")[0][0]}${
            name.split(" ")[name.split(" ").length - 1][0]
          }`
        : name[0].toUpperCase(),
    };
  }

  return (
    <>
      {currentUser ? (
        <Avatar
          onClick={handleClick}
          {...stringAvatar(currentUser.full_name)}
        />
      ) : (
        <Skeleton
          sx={{ bgcolor: "grey.500" }}
          variant="circular"
          width={40}
          height={40}
        />
      )}
      <Menu
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1e4620", // Muda a cor de fundo
            color: "white",
            marginTop: "8px", // Muda a cor do texto
            borderRadius: '0px'
          },
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon sx={{ color: indigo[50] }} fontSize="small" />
          </ListItemIcon>
          {"Perfil"}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ color: indigo[50] }} fontSize="small" />
          </ListItemIcon>
          {"Sair"}
        </MenuItem>
      </Menu>
    </>
  );
}
