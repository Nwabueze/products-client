import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { Store } from "../utils/Store";
import axios from 'axios';
import Cookies from "js-cookie";
import CssBaseline from '@mui/material/CssBaseline';
import useStyles from "../utils/styles";

const NavBar = ({...props}) => {
  const css = useStyles();
  const { state, dispatch } = useContext(Store);
  const {user} = state;
   
  const logout = () => {
    try{
      Cookies.remove('user');
      const { data } = axios.get('/api/user/logout');
      if(data.status){
        dispatch({ type: 'USER_LOGOUT'});
        props.history.push('/login');
      }
    }catch(err){

    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" style={{boxShadow: 'unset'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Stack
        direction={{ xs: 'row', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Link className={`${css.pointer}`} style={{color:'white', }} to="/" underline="none">
          {'Home'}
        </Link>
        { user ? 
        <Link className={`${css.pointer}`} style={{color:'white', }} to="/" underline="none">
          {'Products'}
        </Link> : ''
        }
        { user ? '' :
        <Link className={`${css.pointer}`} style={{color:'white', }} to="/login" underline="none">
          {'Login'}
        </Link>
        }

        {user ? <span className={`${css.pointer}`} onClick={logout}>Logout</span> : ''}
        
      </Stack>
        </Toolbar>
      </Container>
    </AppBar>
    </React.Fragment>
    
  );
};
export default NavBar;

