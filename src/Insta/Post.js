import React, { useState, useEffect } from 'react'
import './Post.css'
import {Avatar, Button} from '@material-ui/core'
import { db } from '../firebase/firebase'
import firebase from 'firebase'

const Post = ({username, caption, imageUrl, postId, user}) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
                        .collection('posts')
                        .doc(postId)
                        .collection('comments')
                        .orderBy('timestamp', 'desc')
                        .onSnapshot((snapshot) => {
                            setComments(snapshot.docs.map((doc) => doc.data()))
                        })
        } 

        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()

        db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    src="https://img.pngio.com/user-icon-png-transparent-405566-free-icons-library-png-user-256_256.jpg"
                    alt="avatar" />
                    
                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt="postimage"/>

            <h4 className="post__text"><strong>{username} : </strong>{caption}</h4>

            <div className="post__comments">
                {
                    comments.map((comment, i) => (
                        <p key={i}>
                            <b>{comment.username} : </b>{comment.text}
                        </p>
                    ))
                }
            </div>

            {
                !user ? (
                   <div></div>
                ) : (
                    <form className="post__commentBox">
                        <input
                            className="post__input"
                            placeholder="Add A Comment ......"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}  />

                            <Button 
                                type="submit"
                                className="post__button"
                                onClick={postComment}
                                disabled={!comment} >Send</Button>
                    </form>
                )
                
            }

{/* <form className="post__commentBox">
                        <input
                            className="post__input"
                            placeholder="Add A Comment ......"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}  />

                            <Button 
                                type="submit"
                                className="post__button"
                                onClick={postComment}
                                disabled={!comment} >Send</Button>
                    </form> */}


        </div>
    )
}


export default Post