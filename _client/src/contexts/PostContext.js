import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../services/posts'

const Context = React.createContext()

export function usePost() {
    const { id } = useParams()
    const { loading, error, value: post } = useAsync(() => getPost(id), [id])
    const commentsByParentId = useMemo(() => {
        const group = {}
        post.comments.forEach(comment => {
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)
        })
        return group
    }, [post?.comments])
}

export function PostProvider({ children }) {
    const {id } = useParams()
    const { loading, error, value: post } = useAsync(() => getPost(id), [id])
    const [comments, setComments] = useState([])
    const commentsByParentId = useMemo(() => {
        const group = {}
        comments.forEach(comment => {
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)
        })
        return group
    }, [comments])

    useEffect(() => {
        if (post.comments == null) return
        setComments(post.comments)
    }, [post?.comments])

    function getReplies(parentId) {
        return commentsByParentId[parentId]
    }

    function createLocalComment(comment) {
        setComments(prevComments => {
            return [comment, ...prevComments]
        })
    }

    function updateLocalComment(id, message) {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment.id === id) {
                    return { ...comment, message }
                }
                return comment
            })
        })
    }

    function deleteLocalComment(id) {
        setComments(prevC => {
            return prevC.filter(c => c.id !== id)
        })
    }

    function toggleLocalCommentLike(id, addLike) {
        setComments(prevC => {
            return prevC.map(c => {
                if (id === c.id) {
                    if (addLike) {
                        return {
                            ...c,
                            likeCount: c.likeCount + 1,
                            likedByMe: true
                        }
                    } else {
                        return {
                            ...c,
                            likeCount: c.likeCount - 1,
                            likedByMe: true
                        }
                    }
                } else {
                    return c
                }
            })
        })
    }

    return <Context.Provider value={{
        post: { id, ...post },
        rootComments: commentsByParentId[null],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike
    }}>
        {loading ? <h1>Loading</h1> : error ? <h1 className='error-msg'></h1> : children}
    </Context.Provider>
}