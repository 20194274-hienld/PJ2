import React, { useEffect, useState } from "react";
import Navbar from "../NavBar";
import Pin from "../Pin";
import Data from "../Data";
import "../../App.css"
import { Grid, Typography, styled } from "@mui/material";
import CollectionAvatar from "../CollentionAvatar";
import AnotherAvatar from "../AnotherAvatar";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AddNewCollection from "./AddNewCollection";
import axios from "axios";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from "react-router-dom";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function MyAccount({ user }) {
    console.log(user);
    let navigate = useNavigate();
    const [reload, setReload] = useState(1)
    const [listFollow, setListFollow] = useState([])
    const [openAddNewCollection, setOpenAddNewCollection] = useState(false)
    const [chosen, setChosen] = useState(1);
    const [listPost, setListPost] = useState([]);
    const [listCollection, setListCollection] = useState([]);

    const getCollections = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(urlServer + '/api/collection', {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            console.log(response);
            setListCollection(response.data.data)
        }
    }

    const getPosts = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(urlServer + '/api/post', {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            setListPost(response.data.msg)
        }
    }

    const getListFollow = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(urlServer + '/api/follow', {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            setListFollow(response.data.user.listFollow)
        }
    }

    console.log(user);
    
    useEffect(() => {
        getPosts()
        getCollections()
        getListFollow()
    }, [reload])

    return (
        <Grid>
            <div className="contentCenter">
                <img className="avatar" src={user.avatar}></img>
                <Typography variant="h4" component="p" >{user.aka} {user?.right && <CheckCircleOutlineIcon fontSize="medium" color="primary" />}</Typography>
                <div className="buttonsUser">
                    <Typography variant="h7" component="p" sx={{ paddingRight: '15px' }} >{`${user.listFollower ? user.listFollower.length : ''}`} người theo dõi</Typography>
                    <Typography variant="h7" component="p" sx={{ paddingLeft: '15px' }}>{`${user.listFollow ? user.listFollow.length : ''}`} người đang theo dõi</Typography>
                </div>
            </div>

            <AddNewCollection
                reload = {reload}
                setReload = {setReload}
                openAddNewCollection={openAddNewCollection}
                setOpenAddNewCollection={setOpenAddNewCollection}
            ></AddNewCollection>

            <div className="buttonsUser" >
                <button className={`btn1 ${(chosen == 1) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(1) }}>Đã đăng</button>
                <button className={`btn1 ${(chosen == 2) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(2) }}>Đã lưu</button>
                <button className={`btn1 ${(chosen == 3) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(3) }}>Đã theo dõi</button>
            </div>


            <div className="App">
                <main>
                    <div className={`mainContainer ${(chosen == 1) ? 'mainContainer' : 'noneDisplay'}`}>
                        {listPost &&
                            listPost.map((data) => (
                                <Pin
                                    key={data._id}
                                    pinSize={data.size}
                                    imgSrc={data.imgSrc}
                                    url={urlClient + '/post/' + data._id}
                                />
                            ))}
                    </div>

                    <div className={` ${(chosen == 2) ? '' : 'noneDisplay'}`}>
                        <div className="contentCenter">
                            <AddCircleOutlineOutlinedIcon
                                onClick={() => { setOpenAddNewCollection(true) }}
                                fontSize='large'
                                sx={{ cursor: 'pointer', margin: "10px" }} />
                        </div>
                        <div className="mainContainer">
                            {listCollection &&
                                listCollection.map((data) => (
                                    <CollectionAvatar
                                        key={data._id}
                                        pinSize={'small'}
                                        imgSrc={data.avatar}
                                        name={data.topic}
                                        link={data.link}
                                        data={data.listPost}
                                        url={urlClient + '/collection/' + data._id}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className={`mainContainer ${(chosen == 3) ? 'mainContainer' : 'noneDisplay'}`}>
                        {listFollow &&
                            listFollow.map((data) => (
                                <AnotherAvatar
                                    key={data.id}
                                    pinSize={'round'}
                                    imgSrc={data.avatar}
                                    name={data.aka}
                                    url={urlClient + '/user/' + data._id}
                                />
                            ))}
                    </div>

                </main>
            </div>

        </Grid>
    )
}