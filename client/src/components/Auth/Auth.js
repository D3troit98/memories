import React, { useState,useEffect } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import { GoogleLogin } from 'react-google-login'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { gapi } from 'gapi-script';
import useStyles from './styles'
import Input from './Input'
import Icon from './icon'
import {signin, signup} from  "../../actions/auth";

const initialState = {
    firstName:'',
    lastName: '',
    email:'',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isSignup, setIsSignup] = useState(false)
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    useEffect(()=>{
        const start = () =>{
          gapi.client.init({
            clientId:"322780761395-pae7qm86gubo86dsq5ep133pfme7om37.apps.googleusercontent.com",
            scope:'email',
          })
        }
        gapi.load('client:auth2',start)
      },[])

    const handleSubmit = (e) => {
        e.preventDefault();
         if(isSignup){
            //fix the sign up here
                dispatch(signup(formData,navigate))
         }else{
            dispatch(signin(formData,navigate))
         }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const switchMode = () => {
        setIsSignup((prevIsSignUp) => !prevIsSignUp)
        handleShowPassword(false)
    }

    const googleSuccess =async (res) => {
     const result = res?.profileObj; 
     const token = res?.tokenId;

     try {
        dispatch({type: 'AUTH', data:{result,token}})
        navigate('/')
     } catch (error) {
        console.log(error)
     }
    }

    const googleFailure = () => {
        console.log("Google Sign was Unsuccessful . Try Again Later")
    }


    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? '"text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId={"322780761395-pae7qm86gubo86dsq5ep133pfme7om37.apps.googleusercontent.com"}
                        render={(renderProps) => (
                            <Button
                                type="button"
                                className={classes.googleButton}
                                color="primary"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />}
                                variant="contained"
                            >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
                        }

export default Auth