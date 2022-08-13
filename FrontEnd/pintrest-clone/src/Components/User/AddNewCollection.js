import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import Checkbox from '@mui/material/Checkbox';
import { Dialog, DialogContent, DialogTitle, TextField, DialogContentText, DialogActions, Button } from "@mui/material";
import axios from "axios";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`

export default function AddNewCollection(props) {
    const { openAddNewCollection, setOpenAddNewCollection, reload, setReload } = props;
    const [topic, setTopic] = useState('')
    const [checkbox, setCheckbox] = useState(true)

    const createCollection = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.post( urlServer + '/api/collection', {
            topic: topic,
            private: checkbox
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            alert('Create collection successfully')
            setReload(reload + 1)
        } else alert('Create collection failed')
    }

    const handleTopic = (e) => {
        setTopic(e.target.value)
    }

    return (

        <Dialog
            open={openAddNewCollection}
            fullWidth={'md'}
            scroll={'body'}
        >
            <DialogTitle>
                Add new collection
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        onChange={handleTopic}
                    />
                </DialogContentText>
                <DialogContentText sx={{ margin: '20px 0px' }}>
                    Bạn muốn giữ bí mật cho collection này <Checkbox defaultChecked onChange={() => { setCheckbox(!checkbox) }} />
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpenAddNewCollection(false) }}>Cancel</Button>
                <Button onClick={() => { createCollection() }}>Create</Button>
            </DialogActions>
        </Dialog>

    )
}