const Pin = require('../models/Pin');
const User = require('../models/user')
const Comment = require('../models/comment')
const asyncHandler = require('../middleware/asyncHandler')

exports.createPin = asyncHandler(async(req, res) => {
    const {title , description} = req.body
    const url = req.protocol + '://' + req.get('host')
    if(!title || !description || !req.file) return res.status(400).send("Please fill all the inputs")
    try {
        const pin = new Pin ({userId : req.user.userId ,img_url : url + '/images/' + req.file.filename ,title , description})
        await pin.save()
        return res.status(201).json(pin)
    } catch (error) {
        res.status(500)
        throw new Error("Canot create pin!")
    }
})

exports.getPins = asyncHandler(async(req, res) => {
    try {
        const pins  = await Pin.find({}).populate('userId')
        return res.status(200).json(pins)
    } catch (error) {
        res.status(500)
        throw new Error('Cant get Pins')
    }
})

exports.getUserPins = asyncHandler(async(req , res) => {
    const user = await User.findById(req.user.userId);
    if(!user) return res.status(400).send('User not found')
    try {
        const userPins = await Pin.find({ userId: user._id });
        return res.status(200).json(userPins)
    } catch (error) {
        res.status(500)
        throw new Error ('Cant get user pins')
    }
})  

exports.getPin = asyncHandler(async (req, res) => {
    const {pinId} = req.params
    if(!pinId) return res.status(400).send("missing pin id")
    try {
        const pin = await Pin.findById(pinId).populate('userId')
        const comments = await Comment.find({pinId : pinId}).populate('userId');
        res
          .status(200)
          .json({ pin: pin, url: `/pin/${pinId}`, comments: comments });
    } catch (error) {
        res.status(500)
        throw new Error('cant get a pin')
    }
})  

exports.deletePin = asyncHandler(async(req, res) => {
    const {pinId} = req.params
    try {
        await Pin.deleteOne({_id : pinId});
        return res.status(200).send("Pin deleted successfuly")
    } catch (error) {
        res.status(500)
        throw new Error('cant delete a pin')
    }
})

exports.updatePin = asyncHandler(async(req, res) => {
    const {pinId} = req.params;
    const pin = await Pin.findById(pinId);
    
    if(!pin) return res.status(400).send('pin not exist')
        pin.title = req.body.title ? req.body.title : pin.title;
        pin.description = req.body.description  ? req.body.description : pin.description;

    try {
        await pin.save();
        return res.status(200).send('Pin updated successfuly')
    } catch (error) {
        res.status(500)
        throw new Error('cant update pin')
    }
})