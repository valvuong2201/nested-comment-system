import React, { useMemo } from 'react'
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
    const commentsByParentId = useMemo(() => {
        const group = {}
        post.comments.forEach(comment => {
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)
        })
        return group
    }, [post?.comments])

    function getReplies(parentId) {
        return commentsByParentId[parentId]
    }

    return <Context.Provider value={{
        post: { id, ...post },
        rootComments: commentsByParentId[null],
        getReplies
    }}>
        {loading ? <h1>Loading</h1> : error ? <h1 className='error-msg'></h1> : children}
    </Context.Provider>
}