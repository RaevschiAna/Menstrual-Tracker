import models from '../../models/index.mjs'

const getAllCommentsForProject = async (req, res, next) => {
  try {
    const query = {
      where: {
        taskId: req.params.tid
      }
    }
    const filterQuery = {
      where: {
        taskId: req.params.tid
      }
    }
    const count = await models.Comment.count({
      ...filterQuery,
      include: {
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: 'comment'
        },
        required: false
      }
    })
    const data = await models.Comment.findAll({
      ...query,
      include: [{
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: 'comment'
        },
        required: false
      }, {
        model: models.User,
        required: false,
        as: 'author',
        attributes: ['id', 'email']
      }]
    })
    res.status(200).json({ data, count })
  } catch (err) {
    next(err)
  }
}

const getOneCommentForProject = async (req, res, next) => {
  try {
    const comment = await models.Comment.findOne({
      where: {
        id: req.params.cid,
        taskId: req.params.tid
      },
      include: [{
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: 'comment'
        },
        required: false
      }, {
        model: models.User,
        required: false,
        as: 'author',
        attributes: ['id', 'email']
      }]
    })
    if (comment) {
      res.status(200).json(comment)
    } else {
      res.status(404).json({ message: 'Comment not found' })
    }
  } catch (err) {
    next(err)
  }
}

const createOwnedCommentForProject = async (req, res, next) => {
  try {
    const comment = await models.Comment.create({
      ...req.body,
      taskId: req.params.tid
    })
    await models.Permission.create({
      forResource: comment.id,
      forUser: req.params.uid,
      type: 'comment',
      rights: ['read', 'write']
    })
    res.status(201).json(comment)
  } catch (err) {
    next(err)
  }
}

const updateOwnedCommentForProject = async (req, res, next) => {
  try {
    const comment = await models.Comment.findOne({
      where: {
        id: req.params.cid,
        taskId: req.params.tid
      }
    })
    if (comment) {
      await comment.update(req.body)
      res.status(200).json(comment)
    } else {
      res.status(404).json({ message: 'Comment not found' })
    }
  } catch (err) {
    next(err)
  }
}

const deleteOwnedCommentForProject = async (req, res, next) => {
  try {
    const comment = await models.Comment.findOne({
      where: {
        id: req.params.cid,
        taskId: req.params.tid
      }
    })
    const permission = await models.Permission.findOne({
      where: {
        forResource: req.params.cid,
        forUser: req.params.uid,
        type: 'comment'
      }
    })
    if (comment && permission) {
      await permission.destroy()
      await comment.destroy()
      res.status(204).end()
    } else {
      res.status(404).json({ message: 'Comment not found' })
    }
  } catch (err) {
    next(err)
  }
}

export default {
  getAllCommentsForProject,
  getOneCommentForProject,
  createOwnedCommentForProject,
  updateOwnedCommentForProject,
  deleteOwnedCommentForProject
}
