import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { updateComment, deleteComment } from '../../../stores/actions/comment-actions'

// selectors
const userIdSelector = state => state.user.data.id

const Comment = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(comment.title)
  const [description, setDescription] = useState(comment.description)

  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const userId = useSelector(userIdSelector)

  const canEdit = userId === comment.permission?.forUser

  const handleSave = async () => {
    const action = await updateComment(userId, params.pid,params.tid, comment.id, {
      title,
      description
    })
    dispatch(action)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    const action = await deleteComment(userId, params.pid,params.tid, comment.id)
    dispatch(action)
  }

  return (
    <tr>
      {
        canEdit
          ? (
              isEditing
                ? (
                  <>
                    <td>
                      <input
                        type='text'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type='text'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                      <button onClick={() => setIsEditing(false)}>Cancel</button>
                      <button onClick={handleSave}>
                        Save
                      </button>
                    </td>
                  </>
                  )
                : (
                  <>
                    <td>{comment.title}</td>
                    <td>{comment.description}</td>
                    <td>
                      <button onClick={() => setIsEditing(true)}>Edit</button>
                      <button onClick={handleDelete}>
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/projects/${params.pid}/tasks/${params.tid}/comments/${comment.id}`)
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </>
                  )
            )
          : (
            <>
              <td>{comment.title}</td>
              <td>{comment.description}</td>
              <td>
                <button
                  onClick={() => {
                    navigate(`/projects/${params.pid}/tasks/${params.tid}/comments/${comment.id}`)
                  }}
                >
                  Details
                </button>
              </td>
            </>
            )
      }
    </tr>
  )
}

export default Comment
