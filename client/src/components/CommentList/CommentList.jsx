import './CommentList.css'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Comment from './Comment'
import { getAllComments } from '../../stores/actions/comment-actions'

// selectors
const commentDataSelector = state => state.comment.data
const userIdSelector = state => state.user.data.id

const CommentList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const comments = useSelector(commentDataSelector)
  const userId = useSelector(userIdSelector)

  useEffect(() => {
    if (!userId || !params.pid ||!params.tid) {
      return
    }

    const loadComments = async () => {
      const action = await getAllComments(userId, params.pid,params.tid)
      dispatch(action)
    }

    loadComments()
  }, [dispatch, userId, params.pid,params.tid])

  return (
    <div className='comment-list'>
      <h1>Comment list</h1>
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </tbody>
      </table>
      <div className='footer'>
        <button onClick={() => navigate(`/projects/${params.pid}/tasks/${params.tid}/comments/new`)}>
          Create Comment
        </button>
      </div>
    </div>
  )
}

export default CommentList