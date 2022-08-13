import React, { useEffect, useState } from 'react';
import { } from "@mui/material";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import SignIn from "./Components/Login/SignIn";
import SignUp from "./Components/Login/SignUp";
import MainDisplay from "./Components/User/MainDisplay"
import Admin from './Components/Admin/Admin';
import Account from './Components/Another/Account';
import MyAccount from './Components/User/MyAccount';
import MyCollection from './Components/User/MyCollection';
import PostDisplay from './Components/PostDisplay';
import PostTable from './Components/Admin/PostTable/PostTable';
import Navbar from './Components/NavBar';
import axios from 'axios';
import { Collections } from '@mui/icons-material';

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [isChange, setIsChange] = useState(true)
  const [user, setUser] = useState({});
  const [reload, setReload] = useState(1);
  const [searchUser, setSearchUser] = useState('');

  const session = {
    [role]: true,
  }

  const getUser = () => {
    const roleNew = localStorage.getItem('role');
    setRole(roleNew)
    if (session.user) {
      const token = localStorage.getItem('token')
      setToken(localStorage.getItem('token'))
      axios.get(urlServer + '/api/user', {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'content-type': 'application/json'
        }
      }).then(res => {
        if (res.data.status) {
          setUser(res.data.user)
        }
        if (!res.data.status) {
          localStorage.clear();
          setToken(null)
        }
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [reload])

  return (
    <Router>
      {session.user && token && <Navbar setReload={setReload} reload={reload} setToken={setToken} setRole={setRole} user={user} setSearchUser={setSearchUser}></Navbar>}
      <Routes>
        <Route exact path="/admin/post" element={<PostTable />} />

        {isChange && !token && <Route exact path="/" element={<SignIn setToken={setToken} setRole={setRole} reload={reload} setReload={setReload} callBack={() => { setIsChange(false) }} />} />}
        {!isChange && !token && <Route exact path="/" element={<SignUp callBack={() => { setIsChange(true) }} />} />}
        {token ? (<Route exact path="/" element={<Navigate to={`/${role}`} replace={true} />} />) : (<Route exact path="/" element={<Navigate to="/" />} />)}

        {/* Admin router */}
        {session.admin && token && <Route exact path="/admin" element={<Admin setToken={setToken} setRole={setRole} />} />}

        {/* User router */}
        {session.user && token && <Route exact path="/collection/:id" element={<MyCollection user={user} />} />}
        {session.user && token && <Route exact path="/display" element={<MainDisplay user={user} searchUser={searchUser} />} />}
        {((session.user && token) || (session.admin)) && <Route exact path="/post/:id" element={<PostDisplay user={user} setReloadMain={setReload} reloadMain={reload} />} />}
        {session.user && token && <Route exact path="/user" element={<MyAccount user={user} />} />}
        {session.user && token && <Route exact path="/user/:id" element={<Account user={user} setReload={setReload} reload={reload} />} />}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>

  );
}

export default App;
