import { Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import moment from 'moment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import axios from "axios";

const urlServer = `${process.env.REACT_APP_LINK_SERVER}`
const urlClient = `${process.env.REACT_APP_LINK_CLIENT}`

const Post = ({ user, setReloadMain, reloadMain }) => {
  console.log(user);
  const listCollection = user.listCollection
  const [chosen, setChosen] = useState(1)
  const [reload, setReload] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null);
  const array = ['Delete', 'Report']
  const openEx = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [avatarCreator, setAvatarCreator] = useState('')
  const [comment, setComment] = useState([])
  const [contentText, setContentText] = useState('')

  let navigate = useNavigate();


  const DeletePost = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(urlServer + '/api/delete', {
      idPost: id
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      alert("Xóa post thành công!");
      setReloadMain(reloadMain + 1)
    } else alert("Thực hiện thao tác thất bại!")
  }

  const ReportPost = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(urlServer + '/api/report', {
      idPost: id
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      alert("Báo cáo post thành công!");
    } else alert(response.data.msg)
  }

  const handleArray = (key) => {
    if (key == 0) DeletePost(id)
    if (key == 1) ReportPost(id)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleComment = (e) => {
    setContentText(e.target.value)
  }

  const likOrUnlikePost = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.post(urlServer + '/api/like', {
      postID: id,
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
  }

  const savePost = async (collectionID) => {
    console.log(collectionID);
    const token = localStorage.getItem('token')
    const response = await axios.post(urlServer + '/api/collection/addPost', {
      postID: id,
      collectionID: collectionID,
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    console.log(response);
    if (response.data.status) {
      alert(response.data.msg)
    } else {
      alert(response.data.msg)
    }
  }

  const createComment = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.post(urlServer + '/api/comment', {
      postID: id,
      content: contentText,
      name: user.aka,
    }, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      alert("Đăng tải comment thành công!")
      setContentText('')
      setReload(reload + 1)
    } else {
      alert("Đăng tải comment thất bại!")
    }
  }

  const getPost = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(urlServer + '/api/displayPost?id=' + id, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    if (response.data.status) {
      setAvatarCreator(response.data.post.createdBy.avatar)
      setPost(response.data.post)
      setComment(response.data.post.comment)
    } else navigate(`/`);
  }

  console.log(post);

  useEffect(() => {
    getPost()
  }, [reload])

  return (
    <Card sx={{ margin: '10px auto', maxWidth: '600px' }}>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={openEx}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {(chosen === 1) && array.map((item, key) => (
          <MenuItem key={key} onClick={(e) => {
            handleArray(key)
            handleClose()
          }}>{item}</MenuItem>
        )
        )}

        {(chosen === 0) && listCollection.map((item, key) => (
          <MenuItem key={key} onClick={(e) => { savePost(item._id) }}>{item.topic}</MenuItem>
        )
        )}

      </Menu>

      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red", cursor: 'pointer' }}
            aria-label="recipe"
            src={avatarCreator}
            onClick={(e) => {
              navigate('/user/' + post.createdBy._id)
            }}
          />
        }
        action={
          <IconButton aria-label="settings" onClick={(e) => {
            setChosen(1)
            handleClick(e)
          }}>
            <MoreVert />
          </IconButton>
        }
        title={post && post.createdBy && post.createdBy.aka}
        subheader={post.createdAt ? moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a') : ''}
      />
      {post.imgSrc &&
        <CardMedia
          component="img"
          height="20%"
          image={post.imgSrc}
          alt="Paella dish"
          sx={{ objectFit: 'cover' }}
        />}
      {!post.imgSrc &&
        <div className="contentCenter" >
          <CircularProgress sx={{ height: '100px', width: '100px' }} />
        </div>
      }
      <CardContent>
        <Typography variant="h5" component="p" sx={{ margin: "10px 0px" }}>{`${post.header ? post.header : 'There is no header'}`}</Typography>
        <Typography variant="body2" color="text.secondary">
          {`${post.description ? post.description : 'there is no description'}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing >

        {user?._id && post.listOfLike && !post.listOfLike.includes(user._id) &&
          <IconButton aria-label="add to favorites" onClick={likOrUnlikePost}>
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite sx={{ color: "red" }} />}
            />
          </IconButton>}

        {user?._id && post.listOfLike && post.listOfLike.includes(user._id) &&
          <IconButton aria-label="add to favorites" onClick={likOrUnlikePost}>
            <Checkbox
              icon={<Favorite sx={{ color: "red" }} />}
              checkedIcon={<FavoriteBorder />}
            />
          </IconButton>}

        {user?._id && <AddLocationAltIcon sx={{ margin: '0px 10px', cursor: 'pointer' }} onClick={(e) => {
          setChosen(0)
          handleClick(e)
        }} />}
        <IconButton aria-label="share">
          <Badge badgeContent={comment.length} color="primary">
            <Checkbox onClick={(e) => {
              setOpen(!open)
            }}
              icon={<ChatBubbleIcon />}
              checkedIcon={<ChatBubbleOutlineIcon />}
            />

          </Badge>
        </IconButton>
      </CardActions>
      <div className={`noneDisplay ${open ? 'wrapper' : 'noneDisplay'}`}>
        {user?._id &&
          <div className="form">
            <div className="input-group textarea">
              <label for="comment">Comment</label>
              <textarea id="comment" name="comment" placeholder="Enter your Comment" onChange={handleComment} value={contentText} required></textarea>
            </div>
            <div className="input-group">
              <button className="btn" onClick={createComment} >Post Comment</button>
            </div>
          </div>
        }

        {comment && comment.map((data, key) => (
          <div key={key} className="prev-comments">
            <div className="single-item">
              <h5>{data.name}</h5>
              <p>{data.content}</p>
            </div>
          </div>
        ))}

      </div>
    </Card>
  );
};

export default Post;