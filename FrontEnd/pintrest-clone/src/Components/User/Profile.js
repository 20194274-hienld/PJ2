import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, DialogContentText, DialogActions, Button } from "@mui/material";
import axios from "axios";
import ChangePassword from "./ChangePassword";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const token = localStorage.getItem('token')

export default function Profile(props) {
    const { openProfile, setOpenProfile, nameDefault, avatarDefault, setReload, reload } = props;
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [url, setUrl] = useState(avatarDefault);
    console.log(url);
    const [name, setName] = useState(nameDefault);
    let avatar = 'https://cdn-icons-png.flaticon.com/512/147/147144.png';

    useEffect(() => {
        setUrl(avatarDefault)
        setName(nameDefault)
    }, [avatarDefault, nameDefault])

    const changeInfor = async ({ name, url }) => {
        const response = await axios.post(urlServer + '/api/change', {
            newName: name,
            newAvatar: url
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            alert(response.data.msg)
            setReload(!reload)
        } else alert(response.data.msg)
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
                console.log("HUy dong");
                setUrl(data.url)
            })
            .catch(err => console.log(err))
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    return (

        <Dialog
            open={openProfile}
            fullWidth={'md'}
            scroll={'body'}
        >
            <DialogTitle>
                <div>Profile</div>
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
                        sx={{ marginBottom: '20px' }}
                        onChange={handleName}
                        defaultValue={`${nameDefault ? nameDefault : ""}`}
                    />
                    <input type="file"
                        onChange={(e) => {
                            uploadImage(e.target.files[0])
                        }}></input>
                    <img src={`${url ? url : avatar}`} className="img-preview-wrapper" ></img>
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpenProfile(false) }}>Cancel</Button>
                <Button onClick={() => { changeInfor({ name, url }) }} >Save</Button>
                <Button onClick={() => { setOpenChangePassword(true) }}>Change Password</Button>
            </DialogActions>

            <ChangePassword
                openChangePassword={openChangePassword}
                setOpenChangePassword={setOpenChangePassword}
            ></ChangePassword>

        </Dialog>

    )
}