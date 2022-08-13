import React, { useEffect, useState } from "react";
import Pin from "../Pin";
import Data from "../Data";
import "../../App.css"
import { Grid, Typography } from "@mui/material";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function MyCollection() {
    const { id } = useParams();
    const [collection, setColletion] = useState({})
    const [reload, setReload] = useState(0)
    
    let navigate = useNavigate();

    const changePrivate = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.post(urlServer + '/api/collection/private',{
            collectionID: collection._id
        } , {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            setReload(reload + 1)
            alert('Change private successfully')
        } else {
            alert('You cannot change private')
        }
    }

    const getCollection = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(urlServer + '/api/collectionid?id=' + id, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            setColletion(response.data.data)
        }
    }

    useEffect(() => {
        getCollection()
    }, [reload])

    return (
        <Grid>
            <div className="contentCenter">
                <img className="avatar" src={`${collection ? collection.avatar : "https://cdn-icons-png.flaticon.com/512/147/147144.png"}`}></img>
                <Typography variant="h4" component="p" >{collection && collection.topic}</Typography>
            </div>

            <div className="buttonsUser" >
                {collection && !collection.private && <LockOpenOutlinedIcon onClick={changePrivate} cursor='pointer' />}
                {collection && collection.private && <LockOutlinedIcon onClick={changePrivate} cursor='pointer' />}
            </div>

            <div>

            </div>

            <div className="App">
                <main>

                    <div className="mainContainer">
                        {collection.listPost &&
                            collection.listPost.map((data) => (
                                <Pin
                                    key={data._id}
                                    pinSize={data.size}
                                    imgSrc={data.imgSrc}
                                    url={urlClient + '/post/' + data._id}
                                />
                            ))}
                    </div>
                </main>
            </div>

        </Grid>
    )
}
