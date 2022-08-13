import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import { Dialog, DialogContent, DialogTitle, TextField, DialogContentText, DialogActions, Button } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import { AltRoute } from "@mui/icons-material";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const token = localStorage.getItem('token')

export default function ChangePassword(props) {
    const { openChangePassword, setOpenChangePassword } = props;
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')


    const reqToServer = async ({ oldPassword, newPassword }) => {
        const response = await axios.post(urlServer + '/api/password', {
            oldPassword: oldPassword,
            newPassword: newPassword
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        alert(response.data.msg)
    }

    const changePassword = () => {
        console.log('Vao ham');
        if (oldPassword !== newPassword) {
            if (newPassword === confirmNewPassword) {
                reqToServer({oldPassword, newPassword})
            } else alert('Xác nhận lại mật khẩu mới!')
        } else alert('Mật khẩu mới phải khác mật khẩu cũ!')
    }

    const handleOldPassword = (e) => {
        setOldPassword(e.target.value)
    }

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value)
    }

    const handleConfirmNewPassword = (e) => {
        setConfirmNewPassword(e.target.value)
    }


    return (

        <Dialog
            open={openChangePassword}
            fullWidth={'md'}
            scroll={'body'}
        >
            <DialogTitle>
                <div>Change password</div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        // id="header"
                        label="Old password"
                        type="password"
                        fullWidth
                        onChange={handleOldPassword}
                        variant="standard"
                        sx={{ margin: '10px 0px' }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        // id="header"
                        label="New password"
                        type="password"
                        fullWidth
                        onChange={handleNewPassword}
                        variant="standard"
                        sx={{ margin: '10px 0px' }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        // id="header"
                        label="Confirm new password"
                        type="password"
                        fullWidth
                        onChange={handleConfirmNewPassword}
                        variant="standard"
                        sx={{ margin: '10px 0px' }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpenChangePassword(false) }}>Cancel</Button>
                <Button onClick={changePassword} >Change</Button>
            </DialogActions>
        </Dialog>

    )
}