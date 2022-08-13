import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AlertDialog from '../Dialog';
import axios from 'axios';

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`

export default function UserTable({ userTable, reload, setReload }) {
    console.log(userTable);
    const titleAction = "Thay đổi xác nhận";

    const callBack = async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(urlServer + '/api/admin/user', {
            userID: id
        }, {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
            'content-type': 'application/json'
          }
        });
        if (response.data.status) {
            setReload(reload + 1);
            alert("Chuyển trạng thái người dùng thành công!");
        } else alert("Thực hiện thao tác thất bại!")
    }

    const columns = [
        { field: 'name', headerName: 'Tên', width: 280 },
        { field: 'numberTrue', headerName: 'Số post đã check', width: 170 },
        {
            field: 'numberFalse',
            headerName: 'Số post chưa check',
            width: 170,
        },
        { field: 'report', headerName: 'Số post bị report', width: 170 },
        { field: 'right', headerName: 'Xác nhận tác giả', width: 170 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <AlertDialog title={titleAction} callBack={(e) => {callBack(id)}} />
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
                                rows={userTable}
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