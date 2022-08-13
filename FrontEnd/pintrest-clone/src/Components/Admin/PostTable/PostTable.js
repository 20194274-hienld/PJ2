import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate } from 'react-router-dom';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function PostTable({ list, reload, setReload }) {
  console.log(list);

  let navigate = useNavigate();

  const deletePost = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(urlServer + '/api/delete', {
      idPost: id
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      setReload(reload + 1);
      alert("Xóa post thành công!");
    } else alert("Thực hiện thao tác thất bại!")
  }

  const checkPost = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(urlServer + '/api/admin/post', {
      postID: id
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      setReload(reload + 1);
      alert("Kiểm duyệt post thành công!");
      if (response.data.user) {
        alert("Người dùng này đã được xác nhận!");
      }
    } else alert("Thực hiện thao tác thất bại!")
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID Post',
      width: 250
    },
    { field: 'author', headerName: 'Tác giả', width: 180 },
    { field: 'count', headerName: 'Số post liên tục được duyệt', width: 200 },
    { field: 'checked', headerName: 'Kiểm duyệt', width: 150 },
    { field: 'right', headerName: 'Xác nhận tác giả', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Box sx={{ display: 'contents' }}>
            <i title="Kiểm duyệt">
              <CheckOutlinedIcon sx={{ cursor: 'pointer' }} onClick={(e) => { checkPost(id) }} />
            </i>
            <i title="Xóa post">
              <ClearOutlinedIcon sx={{ cursor: 'pointer' }} onClick={(e) => { deletePost(id) }} />
            </i>
            <a href={urlClient + '/post/' + id} title="Truy cập">
              <ArrowForwardOutlinedIcon sx={{ cursor: 'pointer' }}
              />
            </a>
          </Box>
        ];
      },
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        marginLeft: 0,
      }}
    >

      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={12} lg={12}>
            <div style={{ height: 650, width: '100%', backgroundColor: 'white' }}>
              <DataGrid
                rows={list}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection
              />
            </div>
          </Grid>

        </Grid>
      </Container>
    </Box>

  );
}