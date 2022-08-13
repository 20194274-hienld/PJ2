import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function ReportTable( { report, reload, setReload }) {

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

  const rejectPost = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(urlServer + '/api/reject', {
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
      alert("Từ chối report thành công!");
    } else alert("Thực hiện thao tác thất bại!")
  }

  const columns = [
    { field: 'id', headerName: 'ID Post', width: 400 },
    { field: 'author', headerName: 'Tác giả', width: 250 },
    { field: 'right', headerName:'Xác nhận tác giả', width: 250 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Box sx={{ display: 'contents' }}>
            <i title="Loại ra khỏi danh sách">
              <HideImageOutlinedIcon sx={{ cursor: 'pointer' }} onClick={(e) => { rejectPost(id) }}/>
            </i>
            <i title="Xóa Post">
              <ClearOutlinedIcon sx={{ cursor: 'pointer' }} onClick={(e) => {deletePost(id)} }/>
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
                rows={report}
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

