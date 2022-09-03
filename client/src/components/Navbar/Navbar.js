import React,{useState,useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import { AppBar,Avatar,Toolbar,Typography,Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import memoriesLogo from "../../images/memories.png"
import useStyles from './styles'
import { useNavigate } from 'react-router-dom'
import decode from 'jwt-decode'

const Navbar = () => {
    const classes = useStyles();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    console.log(user)

    useEffect(()=>{
        const token = user?.token;
        if(token){
            const decodedToken = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout()
        }
        setUser(JSON.parse(localStorage.getItem('profile')))
        
    },[location])


    const logout = () =>{
        dispatch({type: 'LOGOUT'});

        navigate("/")
        setUser(null)
    }

  return (
    <AppBar position= "static" color='inherit' className={classes.appBar}>
        <div className={classes.brandContainer}>

    <Typography component={Link} to="/" className={classes.heading} variant="h2" align='center'>ANIMECON</Typography>
    <img src={memoriesLogo} alt="memories" height={60} className={classes.image}/>
        </div>
        <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                        <Button variant = "contained" className={classes.logout} color = "secondary" onClick={logout}>Logout</Button>
                    </div>
                ): (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign in</Button>
                )}
        </Toolbar>
  </AppBar>
  )
}

export default Navbar