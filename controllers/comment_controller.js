const User = require('../models/user')
const Pin = require('../models/Pin');
const Comment = require('../models/comment')
const asyncHandler = require('../middleware/asyncHandler');
const comment = require('../models/comment');

exports.createComment = asyncHandler(async(req, res) => {
    const {content , pinId} = req.body;
    if(!content) return res.status(400).send('Please fill the input field');
    if(!pinId) return res.status(400).send("Please select a pin to comment");
    const comment = new Comment({
      userId: req.user.userId,
      pinId: pinId,
      content,
    });
    try {
        await comment.save()
        return res.status(201).json(comment)
    } catch (error) {
        res.status(500)
        throw new Error('Cnat post a comment')
    }
})
exports.getPinComments = asyncHandler(async(req,res) => {
    const { pinId } = req.query;
    if(!pinId) return res.status(400).send('there is no pin Id find');
    try {
        const pinComments = await Comment.find({pinId : pinId}).populate('userId');
        return res.status(200).json(pinComments)
    } catch (error) {
        res.status(500);
        throw new Error('Cant get pin comments')
    }
})

exports.deleteComment = asyncHandler(async(req, res) => {
    const {comment_id} = req.body;
    if(!comment) return
    try {
        await Comment.deleteOne({_id : comment_id});
        return res.status(200).send('comment deleted')
    } catch (error) {
        res.status(500)
        throw new Error('cant remove a comment')
    }
})