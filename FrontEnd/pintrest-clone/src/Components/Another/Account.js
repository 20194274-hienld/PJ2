import React, { useEffect, useState } from "react";
import Pin from "../Pin";
import Data from "../Data";
import "../../App.css"
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AnotherAvatar from "../AnotherAvatar";
import CollectionAvatar from "../CollentionAvatar";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function Account({ user, reload, setReload }) {
    let navigate = useNavigate();
    const [ load, setLoad] = useState(1)
    const [chosen, setChosen] = useState(1);
    const [listFollow, setListFollow] = useState([])
    const [listPost, setListPost] = useState([]);
    const [listCollection, setListCollection] = useState([]);
    const [channel, setChannel] = useState({});
    const { id } = useParams();

    if (id === user._id) {
        navigate('/user')
    }

    const follow = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.post(urlServer + '/api/follow', {
            userIDFollow: id,
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            alert("Theo dõi thành công")
            setReload(reload + 1)
        } else {
            alert(response.data.msg)
        }
    }

    const unFollow = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.post(urlServer + '/api/unfollow', {
            userIDUnfollow: id,
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            alert("Bỏ theo dõi thành công")
            setReload(reload + 1)
        } else {
            alert(response.data.msg)
        }
    }

    const getInfor = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(urlServer + '/api/another?id=' + id, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        if (response.data.status) {
            console.log(response.data.user);
            setListPost(response.data.post);
            setListFollow(response.data.user.listFollow)
            setListCollection(response.data.collection);
            setChannel(response.data.user);
            setLoad(load+1)
        } else {
            navigate('/user')
        }
    }

    useEffect(() => {
        getInfor()
    }, [load])

    return (
        <Grid>
            <div className="contentCenter">
                <img className="avatar" src={channel.avatar}></img>
                <Typography variant="h4" component="p" >{channel.aka} {channel?.right && <CheckCircleOutlineIcon fontSize="medium" color="primary" />}</Typography>
                <div className="buttonsUser">
                    <Typography variant="h7" component="p" sx={{ paddingRight: '15px' }} >{`${channel.listFollower ? channel.listFollower.length : ''}`} người theo dõi</Typography>
                    <Typography variant="h7" component="p" sx={{ paddingLeft: '15px' }}>{`${channel.listFollow ? channel.listFollow.length : ''}`} người đang theo dõi</Typography>
                </div>
                <div className="buttonsUser">
                    {user.listFollow && user.listFollow.includes(id) && <Button sx={{ margin: '-13px 0px' }} variant="text" size="large" onClick={unFollow} >Đang theo dõi</Button>}
                    {user.listFollow && !user.listFollow.includes(id) && <Button sx={{ margin: '-13px 0px' }} variant="text" size="large" onClick={follow} >Theo dõi</Button>}
                </div>
            </div>

            <div className="buttonsUser" >
                <button className={`btn1 ${(chosen == 1) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(1) }}>Đã đăng</button>
                <button className={`btn1 ${(chosen == 2) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(2) }}>Đã lưu</button>
                <button className={`btn1 ${(chosen == 3) ? 'btn1Active' : 'btn1'}`} onClick={(e) => { setChosen(3) }}>Đã theo dõi</button>
            </div>

            <div>

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

                    <div className={`mainContainer ${(chosen == 2) ? 'mainContainer' : 'noneDisplay'}`}>
                        {listCollection &&
                            listCollection.map((data) => (
                                <CollectionAvatar
                                    key={data._id}
                                    pinSize={'small'}
                                    imgSrc={data.avatar}
                                    name={data.topic}
                                    link={data.link}
                                    url={urlClient + '/collection/' + data._id}
                                    data={data.listPost}
                                />
                            ))}
                    </div>

                    <div className={`mainContainer ${(chosen == 3) ? 'mainContainer' : 'noneDisplay'}`}>
                        {listFollow &&
                            listFollow.map((data) => (
                                <AnotherAvatar
                                    key={data._id}
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