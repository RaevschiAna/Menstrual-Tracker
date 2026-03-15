import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createComment } from '../../stores/actions/comment-actions'

// selectors
const userIdSelector = state => state.user.data.id

const CommentForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const userId = useSelector(userIdSelector)

  const handleCreate = async () => {
    const action = await createComment(userId, params.pid,params.tid, { title, description })
    dispatch(action)
    navigate(`/projects/${params.pid}/tasks/${params.tid}/comments`)
  }

  return (
    <div>
      <h1>Comment Form</h1>
      <input
        type='text'
        placeholder='title'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='description'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={handleCreate}>
        Create
      </button>
    </div>
  )
}

export default CommentForm
