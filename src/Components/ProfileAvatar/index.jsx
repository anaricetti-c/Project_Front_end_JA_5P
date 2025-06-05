import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Fade,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Logout } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

import { UserContext } from "../../Context/user";

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
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile", { state: { user: currentUser } });
  };

  const handleLogout = () => {
    handleClose();
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
      const lightValue = Math.floor((value + 255) / 2);
      const darkValue = Math.floor(value / 2);
      lightColor += `0${lightValue.toString(16)}`.slice(-2);
      darkColor += `0${darkValue.toString(16)}`.slice(-2);
    }

    return [lightColor, darkColor];
  }

  function stringAvatar(name) {
    const [lightBg, darkBg] = stringToColor(name || "??");
    return {
      sx: {
        bgcolor: lightBg,
        color: darkBg,
        fontSize: "15px",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          opacity: 0.85,
          transform: "scale(1.05)",
        },
      },
      children: name
        ? name.includes(" ")
          ? `${name.split(" ")[0][0]}${
              name.split(" ")[name.split(" ").length - 1][0]
            }`
          : name[0].toUpperCase()
        : "?",
    };
  }

  return (
    <>
      {currentUser ? (
        <Avatar
          onClick={handleClick}
          {...stringAvatar(currentUser.full_name)}
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            ...stringAvatar(currentUser.full_name).sx,
            width: 42,
            height: 42,
            transition: "all 0.2s ease-in-out",
            transformOrigin: "center",
            boxShadow: "0 0 0 transparent",
            "&:hover": {
              opacity: 1,
              transform: "scale(1.08)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            },
          }}
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
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slots={{ transition: Fade }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#2f5936",
            color: "white",
            marginTop: "7px",
            borderRadius: "0px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            minWidth: "120px",
          },
          "& .MuiMenuItem-root": {
            padding: "10px 16px",
            fontSize: "15px",
            "&:hover": {
              backgroundColor: "#264b2d",
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon sx={{ color: indigo[50] }} fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ color: indigo[50] }} fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
}
