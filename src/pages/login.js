import { Button, Container, List, ListItem, TextField, Box, Tabs, Tab } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { useState, useContext } from "react";
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
//import queryString from 'query-string';
import { useSnackbar } from "notistack";
import { Store } from "../utils/Store";


export default function Login({ ...props }) {
    const classes = useStyles();
    //const params = queryString.parse(props.location.search);
    //const { redirect } = params;
    //const [userData, setUserData] = useState({});
    const { handleSubmit, control, formState: { errors } } = useForm();
    const { enqueueSnackbar, } = useSnackbar();
    //const [emailAddress, setEmailAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const { dispatch } = useContext(Store);
    


    //const [open, setOpen] = useState(false);
    //const [display, setDisplay] = useState(true);
    const [tab, setTab] = useState('login');
    //const [value, setValue] = useState(0);
    /*
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        setDisplay(true);
    };
    */

    const submitLogin = async ({ email1, password1 }) => {
        if (!email1) {
            enqueueSnackbar(`Invalid email or phone ${email1}`, { variant: "error" });
            return;
        }

        // Start the spinner
        setLoading(true);
        try {
            const { data } = await axios.get(`api/user/login/${email1}/${password1}`);
            setLoading(false);
            if (data.hasOwnProperty("_doc") || data.hasOwnProperty("email")) {
                enqueueSnackbar("Login was successful", { variant: "success" });
                Cookies.set("user", JSON.stringify(data._doc));
                dispatch({ type: 'USER_LOGIN' });
                props.history.push('/');
            } else {
                if (data.hasOwnProperty("reason")) {
                    enqueueSnackbar(data.reason, { variant: "error" });
                    setLoading(false);
                }
            }
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
            setLoading(false);
        }
    }

    const submitRegistration = async ({ name, email, password, }) => {

        setLoading(true);
        try {
            const { data } = await axios.post('api/user/register', { email, name, password, });
            Cookies.set("user", JSON.stringify(data));
            setLoading(false);
            dispatch({ type: 'USER_LOGIN' });
            props.history.push('/');
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
            setLoading(false);
        }
    }

    return (
        
        <Container className={`${classes.bgGray}`} style={{width:'100vw', height: '100vh'}}>
            <Box className={classes.form} mt={3}>
                <Tabs centered>
                    <Tab className={`${tab==='login' ? classes.bgWhite: classes.bgGray}`} label="Login" onClick={() => setTab('login')}/>
                    <Tab className={`${tab==='register' ? classes.bgWhite: classes.bgGray}`} label="Register" onClick={() => setTab('register')}/>
                </Tabs>
            </Box>
            {/** Form login part */}
            { tab === 'login' ?
            (<form className={`${classes.form} ${classes.bgWhite}`} onSubmit={handleSubmit(submitLogin)}
              style={{ borderRadius: '5px'}}>
                <List className={`${classes.pt5} ${classes.mt5}`}>
                    
                    <ListItem>
                        <Controller
                            name="email1"
                            control={control}
                            defaultValue=""
                            rules={{ required: true, minLength: 10 }} render={({ field }) => (
                                <TextField
                                    className={classes.bgWhite}
                                    autoComplete="off"
                                    variant="outlined"
                                    fullWidth id="email1"
                                    label="Email"

                                    inputProps={{ type: "text" }}
                                    error={Boolean(errors.email1)}
                                    helperText={
                                        errors.email1 ?
                                            (errors.email1.type === 'minLength' ? 'Invalid email ' : 'Email is empty') : ''
                                    }
                                    {...field}>
                                </TextField>
                            )}></Controller>

                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password1"
                            control={control}
                            defaultValue=""
                            rules={{ required: true, minLength: 6, }} render={({ field }) => (
                                <TextField
                                    className={classes.bgWhite}
                                    autoComplete="off"
                                    variant="outlined"
                                    fullWidth id="password1"
                                    label="Password"
                                    inputProps={{ type: "password" }}
                                    error={Boolean(errors.password1)}
                                    helperText={
                                        errors.password1 ?
                                            (
                                                errors.password1.type === 'minLength' ?
                                                    'Expecting at least 6 characters' : 'Empty password'
                                            ) : ''
                                    }
                                    {...field}>
                                </TextField>
                            )}></Controller>
                    </ListItem>
                    <ListItem>
                        {
                            loading ? (<LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}
                                variant="outlined" style={{ textTransform: "none" }}
                                fullWidth>
                                Submitting...
                            </LoadingButton>) :
                                (<Button variant="contained" type="submit" color="primary" fullWidth>Login</Button>)
                        }
                    </ListItem>
                </List>
            </form>):(

            
            <form className={`${classes.form} ${classes.bgWhite}`} onSubmit={handleSubmit(submitRegistration)}
               style={{ borderRadius: '5px'}}>
                <List className={classes.pt5}>
                    
                    <ListItem>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{ required: true, pattern: /(\w+)@(\w+)\.(\w+)/, }} render={({ field }) => (
                                <TextField
                                    className={classes.bgWhite}
                                    variant="outlined"
                                    autoComplete="off"
                                    fullWidth id="email"
                                    label="email"
                                    inputProps={{ type: "email" }}
                                    error={Boolean(errors.email)}
                                    helperText={
                                        errors.email ?
                                            (errors.email.type === 'pattern' ? 'Invalid email' : 'Email is empty') : ''
                                    }
                                    {...field}>
                                </TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{ required: true, minLength: 2 }} render={({ field }) => (
                                <TextField
                                    className={classes.bgWhite}
                                    variant="outlined"
                                    autoComplete="off"
                                    fullWidth id="name"
                                    label="Name"
                                    inputProps={{ type: "text" }}
                                    error={Boolean(errors.name)}
                                    helperText={
                                        errors.name ?
                                            (errors.name.type === 'minLength' ? 'Name is too short' : 'Name is empty') : ''
                                    }
                                    {...field}>
                                </TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: true, minLength: 6 }} render={({ field }) => (
                                <TextField
                                    className={classes.bgWhite}
                                    variant="outlined"
                                    autoComplete="off"
                                    fullWidth id="password"
                                    label="Password"
                                    inputProps={{ type: "password" }}
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password ?
                                            (
                                                errors.password.type === 'minLength' ?
                                                    'Expecting at least 6 characters' : 'Empty password'
                                            ) : ''
                                    }
                                    {...field}>
                                </TextField>
                            )}>
                        </Controller>
                    </ListItem>
                    <ListItem>
                        {
                            loading ?
                                (
                                    <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />}
                                        variant="outlined"
                                        fullWidth>
                                        Submitting...
                                    </LoadingButton>
                                ) : (
                                    <Button className={classes.w70} variant="contained" fullWidth type="submit">Register</Button>
                                )
                        }
                    </ListItem>
                </List>
            </form>)}
        </Container>
    )

}