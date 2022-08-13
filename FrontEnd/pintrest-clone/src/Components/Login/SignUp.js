import * as React from 'react';
import axios from "axios";
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
const url = `${process.env.REACT_APP_LINK_SERVER}`

export default function SignUp({ callBack }) {
  const [checked, setChecked] = useState(false)
  
  const register = async ({username, password }) => {
    const response = await axios.post(url + '/api/register' ,{
        username:username,
        password:password
    });
    return response.data;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(checked);
    if (checked) {
      const data = new FormData(event.currentTarget);
      let username = data.get('username')
      let password = data.get('password')
      const {status, msg} = await register({ username, password });
      if (status) {
        alert("Đăng ký thành công!");
        data.set('username', '')
        data.set('password', '')
        console.log(data);
        callBack();
      } else alert("Đăng ký thất bại!")
    } else {
      alert("Hãy chắc chắn bạn đã đọc điều khoản của chúng tôi")
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Link href="https://policy.pinterest.com/vi/terms-of-service" sx= {{ marginLeft: 4}}>
                  Điều khoản dịch vụ
                </Link>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" onChange={() => {
                    setChecked(!checked)
                  }
                  } />}
                  label="Hãy xác nhận chắc chắn là bạn đã đọc điều khoản dịch vụ của chúng tôi!"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => { callBack()}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}