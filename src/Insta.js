import React, { useState, useEffect } from 'react'
import './Insta.css'
import Post from './Insta/Post'
import {db, auth} from './firebase/firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './Insta/ImageUpload';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const Insta = () => {
    
    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(false)
    const [openSignIn, setOpenSignIn] = useState(false)
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState(null)
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
               console.log(authUser)
               setUser(authUser)

              /*  if(authUser.displayName) {
                    
                } else {
                    return authUser.updateProfile({
                        displayName: username
                    })
                } */

            } else {
               setUser(null)
            }
        })

        return () => {
            unsubscribe()
        }
     }, [user, username])


    useEffect(() => {
       db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
           setPosts(snapshot.docs.map(doc => ({
               id: doc.id,
              post: doc.data() 
           })))
       })
    }, [])
    
    const signUp = (event) => {
        event.preventDefault()

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch(error => alert(error.message))

        setOpen(false)
    }

    const signIn = (event) => {
        event.preventDefault()

        auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            alert(error.message)
        })

        setOpenSignIn(false)

    }

    return (
        <div className="app">

            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup" onSubmit={signUp}>
                        <center>
                            <img 
                                className="app__headerImage"
                                src="https://pilotlogic.com/sitejoom/images/allcommon/codetyphon/codetyphon_logo_0.png"
                                alt="headerlogo" />
                            </center>    

                            <Input 
                                type="text"
                                value={username}
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Input 
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />  


                            <Button onClick={signUp} type="submit">Sign Up</Button>  
                        </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup" onSubmit={signUp}>
                        <center>
                            <img 
                                className="app__headerImage"
                                src="https://pilotlogic.com/sitejoom/images/allcommon/codetyphon/codetyphon_logo_0.png"
                                alt="headerlogo" />
                            </center> 

                            <Input 
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />  


                            <Button onClick={signIn} type="submit">Sign In</Button>  
                        </form>
                </div>
            </Modal>


            <div className="app__header">
                <img 
                    src="https://pilotlogic.com/sitejoom/images/allcommon/codetyphon/codetyphon_logo_0.png"
                    className="app__headerImage"
                    alt="logo" />

                {
                    user ?
                        (
                            <div className="app__loginContainer">
                                <Button onClick={()=> auth.signOut()}>Sign Out</Button>
                            </div>
                        ) : (
                            <div className="app__loginContainer">
                                <Button onClick={()=> setOpenSignIn(true)}>Log In</Button>
                                <Button onClick={()=> setOpen(true)}>Sign Up</Button>
                            </div>
                            
                        )
                }    
            </div>
           
            
            <h1>Insta Clone</h1>

            <div className="app__posts">
                    <div className="app__postsLeft">
                        {
                            posts.map(({post, id}) => (
                                <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} user={user} />
                            ))
                        }
                    </div>

                    <div className="app__postsRight">
                        <InstagramEmbed
                            url="https://www.instagram.com/p/B_uf9dmAGPw"
                            maxWidth={320}
                            hideCaption={false}
                            containerTagName="div"
                            protocol=""
                            injectScript 
                            onLoading={() => {}} 
                            onSuccess={() => {}}
                            onAfterRender={() => {}}
                            onFailure={() => {}} 
                        />
                    </div>
            </div>

            
            {
                user?.displayName ?
                (
                    <ImageUpload username={user.displayName} />
                ) : (
                    <h3>Sorry You need to login to Upload!!</h3>
                )
            }

        </div>
    )
}

export default Insta
