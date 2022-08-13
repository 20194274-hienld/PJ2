import React, { useEffect, useState } from "react";
import Pin from "../Pin";
import "../../App.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component"

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function MainDisplay( { searchUser } ) {
    console.log(searchUser);
    // const [reload, setReload] = useState(0);
    const [listPost, setListPost] = useState([])

    const getPosts = async () => {

        const token = localStorage.getItem('token')
        const response = await axios.post(urlServer + '/api/list', {
            query: searchUser,
        }, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            }
        });
        console.log(response);
        if (response.data.status) {
            setListPost(response.data.post)
            // setListPost([...listPost, ...response.data.post])
            console.log(response.data.post);
        }
    }

    useEffect( ()=> {
        getPosts()
        // setSkip(0)
        // handleClick()
        // // setListPost([]);
        // // console.log(listPost);
    }, [searchUser])


    // const handleClick = () => {
    //     setSkip(skip + 15)
    //     getPosts()
    // }

    return (

        <React.Fragment>
            <div className="App">
                <main>
                    {/* <div className="mainContainer"> */}
                        <InfiniteScroll
                            dataLength={listPost.length}
                            // next={handleClick}
                            hasMore={true}
                            className="mainContainer"
                        >
                            {listPost &&
                                listPost.map((data) => (
                                    <Pin
                                        key={data._id}
                                        pinSize={data.size}
                                        imgSrc={data.imgSrc}
                                        url={urlClient + '/post/' + data._id}
                                    />
                                ))}
                        </InfiniteScroll>
                    {/* </div> */}
                </main>
            </div>

        </React.Fragment>
    )
}