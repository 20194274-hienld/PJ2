import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  InputBase,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AbcIcon from '@mui/icons-material/Abc';
import React, { useState } from "react";
import Profile from "./User/Profile";
import CreatePost from "./User/CreatePost";
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "60%",
  borderRadius: "15px",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const Navbar = ({ setReload, reload, user, setToken, setRole, setSearchUser }) => {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [search, setSearch] = useState('')

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  let navigate = useNavigate();
  const handleClick = (link) => {
    navigate(`/${link}`)
  }

  const searchFull = () => {
    setSearchUser(search)
  }

  const signOut = () => {
    localStorage.clear();
    setToken(null)
    setRole(null)
    navigate('/');
  }

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <AbcIcon sx={{ fontSize: 60, cursor: 'pointer' }} onClick={() => { handleClick('display') }} ></AbcIcon>
        <Search>
          <InputBase placeholder="search..." sx={{ width: '100%', padding: '5px' }} onChange={handleChange} />
        </Search>
        <Icons>
          <SearchIcon sx={{ cursor: "pointer" }} size="large" onClick={(e) => {
            searchFull()
            setReload(reload + 1)
            handleClick('display')
          }} />
          <AddCircleIcon
            sx={{ cursor: "pointer" }}
            onClick={() => { setOpenCreatePost(true) }}
          />
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={`${user && user.avatar}`}
            onClick={(e) => setOpen(true)}
          />
        </Icons>
        <UserBox onClick={(e) => setOpen(true)}>
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={`${user && user.avatar}`}
          />
          <Typography variant="span">{`${user && user.aka}`}</Typography>
        </UserBox>
      </StyledToolbar>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => { setOpenProfile(true) }}>Profile</MenuItem>
        <MenuItem onClick={() => { handleClick('user') }}>My account</MenuItem>
        {/* <Link to={`/ngunguoi`}>jhdjfhdjf */}
        <MenuItem onClick={() => { signOut() }}>Logout</MenuItem>
      </Menu>

      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        nameDefault={`${user && user.aka}`}
        avatarDefault={`${user && user.avatar}`}
        setReload={setReload}
        reload={reload}
      ></Profile>

      <CreatePost
        reload = {reload}
        setReload = {setReload}
        openCreatePost={openCreatePost}
        setOpenCreatePost={setOpenCreatePost}
      ></CreatePost>

    </AppBar>
  );
};

export default Navbar;