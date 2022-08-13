import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`

export default function CreatePost(props) {
    const { openCreatePost, setOpenCreatePost, reload, setReload } = props;
    const [url, setUrl] = useState('');
    const [size, setSize] = useState('');
    const [header, setHeader] = useState('');
    const [description, setDescription] = useState('');

    const handleHeader = (e) => {
        setHeader(e.target.value)
    }

    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const createPost = async () => {
        const token = localStorage.getItem('token')
        console.log(header, description, url, size);
        const response = await axios.post(urlServer + '/api/post', {
            header: header,
            description: description,
            imgSrc: url,
            size: size
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            alert("Post thành công!")
        } else alert("Post thất bại!")
    }

    const uploadImage = (i) => {
        const data = new FormData()
        data.append("file", i)
        data.append("upload_preset", "b2fhcmkr")
        data.append("cloud_name", "dtsfilp19")
        fetch("  https://api.cloudinary.com/v1_1/dtsfilp19/image/upload", {
            method: "post",
            body: data
        })
            .then(resp => resp.json())
            .then(data => {
                setUrl(data.url)
                console.log(data.url);
            })
            .catch(err => console.log(err))
    }

    const handleChange = (event) => {
        setSize(event.target.value);
    };


    return (

        <Dialog
            open={openCreatePost}
            fullWidth={'md'}
            scroll={'body'}
        >
            <DialogTitle>
                New Post
            </DialogTitle>
            <DialogContent>
                <Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="header"
                        label="Header"
                        type="header"
                        fullWidth
                        variant="standard"
                        sx={{ margin: '10px 0px' }}
                        onChange={handleHeader}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Description"
                        type="name"
                        fullWidth
                        variant="standard"
                        sx={{ margin: '10px 0px' }}
                        onChange={handleDescription}
                    />
                    <Box sx={{ minWidth: 120, margin: '20px 0px' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Size</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={size}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={'small'}>Small</MenuItem>
                                <MenuItem value={'medium'}>Medium</MenuItem>
                                <MenuItem value={'large'}>Large</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <input type="file"
                            onChange={(e) => {
                                uploadImage(e.target.files[0])
                            }}></input>
                        <img src={url} className="img-preview-wrapper" ></img>
                    </Box>
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpenCreatePost(false) }}>Cancel</Button>
                <Button onClick={() => { createPost() }}>Create</Button>
            </DialogActions>
        </Dialog>

    )
}