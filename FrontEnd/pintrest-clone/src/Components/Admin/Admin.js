import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import PagesIcon from '@mui/icons-material/Pages';
import IconButton from '@mui/material/IconButton';
import ReportIcon from '@mui/icons-material/Report';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect, useState } from 'react';
import Dashboard from './Dashboard/Dashbroad';
import UserTable from './UserTable/UserTable';
import ReportTable from './ReportTable/ReportTable';
import PostTable from './PostTable/PostTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 240;

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);



const menuItems = [
  {
    text: 'Dashbroad',
    icon: <DashboardIcon />,
    path: '/dashbroad'
  },
  {
    text: 'UserTable',
    icon: <SupervisedUserCircleIcon />,
    path: '/usertable'
  },
  {
    text: 'Post',
    icon: <PagesIcon />,
    path: '/'
  },
  {
    text: 'Report',
    icon: <ReportIcon />,
    path: '/'
  },
  {
    text: 'SignOut',
    icon: <ExitToAppIcon />,
    path: '/'
  },
]

const mdTheme = createTheme();

export default function Admin({ setRole, setToken }) {
  const [open, setOpen] = useState(true);
  const [reload, setReload] = useState(1);
  const [screen, setScreen] = useState(0);
  const [report, setReport] = useState([])
  const [userTable, setUserTable] = useState([])
  const [postCheck, setPostCheck] = useState([])

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getUser = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(urlServer + '/api/getuser', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    console.log(response.data);
    if (response.data.status) {
      let userNew = []
      let postNeedChecked = []
      userNew = Object.assign([], userNew);
      console.log(response.data);
      await response.data.false.map((data, key) => {
          userNew.push({ id: data._id, name: data.username, numberFalse: data.listPost.length, right: data.right, report: response.data.report[key].listPost.length  })
          data.listPost.map((post) => {
            postNeedChecked.push({id: post._id, author: data.username, count: data.count, checked: false, right: data.right})
          })
      })

      await response.data.true.map((data, key) => {
          userNew[key].numberTrue = data.listPost.length
      })
      setUserTable(userNew);
      setPostCheck(postNeedChecked);
    }
  }

  const getReport = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(urlServer + '/api/report', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      let report = [];
      report = Object.assign([], report);
      await response.data.data.map((data, key) => {
        report.push({ id: data._id, author: data.createdBy.username, right: data.createdBy.right })
      })
      console.log(report);
      setReport(report)
    }
  }

  useEffect(() => {
    getUser()
    getReport()
  }, [reload])


  let navigate = useNavigate();

  const handleClick = () => {
    setRole(null)
    setToken(null)
    localStorage.clear()
    navigate(`/`)
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              value={menuItems[screen].text}
              sx={{ flexGrow: 1 }}
            >
              {menuItems[screen].text}
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {/* {mainListItems}
            <Divider sx={{ my: 1 }} /> */}
            {menuItems.map((item, key) => {
              return (
                <ListItemButton key={item.text}
                  onClick={() => {
                    if (key == 4) {
                      handleClick();
                    }
                    setScreen(key);
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              )
            })}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        {(screen == 0) && <Dashboard></Dashboard>}
        {(screen == 1) && <UserTable userTable={userTable} reload={reload} setReload={setReload}/>}
        {(screen == 2) && <PostTable list={postCheck} reload={reload} setReload={setReload}/>}
        {(screen == 3) && <ReportTable report={report} reload={reload} setReload={setReload}/>}

      </Box>
    </ThemeProvider>
  );
}
