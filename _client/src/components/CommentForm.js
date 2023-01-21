import React, { useState } from 'react'

const CommentForm = ({ loading, error, autFocus = false, onSubmit, initialValue = '' }) => {
    const [message, setMessage] = useState(initialValue)

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(message).then(() => setMessage(''))
    }

    return (
        <form>
            <div className='comment-form-row'>
                <textarea autoFocus={autoFocus} className='message-input' value={message} onChange={e => setMessage(e.target.value)} />
                <button className='btn' type='submit' disabled={loading} onClick={handleSubmit}>
                    {loading ? 'Loading' : 'Post'}
                </button>
            </div>
            <div className='error-msg'>{error}</div>
        </form>
    )
}

export default CommentForm