import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useState } from 'react';

export default function AlertDialog({ callBack, title }) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <i title={title}>
                <AutorenewIcon cursor="pointer" onClick={handleClickOpen}/>
            </i>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xác nhận"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn thực hiện thao tác này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => {
                        callBack();
                        handleClose();
                    }}>Xác nhận</Button>
                    <Button onClick={handleClose} autoFocus>
                        Thoát
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}