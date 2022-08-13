import React from "react";
import Navbar from "../NavBar";
import Pin from "../Pin";
import Data from "../Data";
import "../../App.css"
import { Button, Grid, Typography } from "@mui/material";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

export default function Collection() {

    return (
        <Grid>

            <Navbar></Navbar>
            <div className="contentCenter">
                <Typography variant="h4" component="p" >Name Collection</Typography>
                <img className="avatarTiny" src="https://icdn.24h.com.vn/upload/1-2021/images/2021-03-08/LaLa-Tran--My-nhan-dung-sau-hang-loat-thanh-cong-dang-nguong-mo-ca-sy-1-1615193102-127-width500height750.jpg"></img>
                <Typography variant="h6" component="p" >Name Owner</Typography>
            </div>

            <div>

            </div>

            <div className="App">
                <main>

                    <div className="mainContainer">
                        {Data &&
                            Data.map((data) => (
                                <Pin
                                    key={data.id}
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