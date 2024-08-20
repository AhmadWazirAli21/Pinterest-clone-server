const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const bcryptjs = require('bcryptjs')
const createToken = require('../utils/createJWT');
const Pin = require('../models/Pin')


exports.register = asyncHandler(async(req,res) => {
    const { username ,name , email , password} = req.body
    if(!username || !email || !password  || !name) return res.status(400).send('Please fill all input fields')
        const userExist = await User.findOne({email : email});
        if(userExist) return res.status(400).send( "User already exist")
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password , salt);
        const newUser = new User ({username ,name,email , password : hashedPassword});
        try {
            await newUser.save()
            const token = createToken(newUser._id);
            return res.status(201).json({
              id: newUser._id,
              username: newUser.username,
              name : newUser.name,
              email: newUser.email,
              token: token,
            //   about: updatedUser.about,
            //   avatar: updatedUser.avatar,
            });
        } catch (error) {
            res.status(400);
            throw new Error("Invalid user data");
        }
})

exports.login = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please fill all input fields");
    const userNotExist = await User.findOne({email : email})
    if(!userNotExist) return res.status(404).send('User not exist')
    try {
        const user = await User.findOne({email})
        const comparedPassword = await bcryptjs.compare(password,user.password);
        if (!comparedPassword) return res.status(400).send("Wrong username or password");
        const token = createToken(user._id);
     
        return res.status(200).json({
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          token: token,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
})

exports.updateProfile = asyncHandler(async(req, res) => {
    const url = req.protocol + "://" + req.get('host')
    const user = await User.findById(req.user.userId);
    
    if (user) {
      user.username = req.body.username ? req.body.username : user.username;
      user.name = req.body.name ? req.body.name : user.name;
      user.avatar = req.file ? url + "/images/" + req.file.filename  : user.avatar;
      user.about = req.body.about ? req.body.about : user.about;
      if (req.body.password) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(req.body.password, salt);
      }
      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        about : updatedUser.about,
        avatar : updatedUser.avatar
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }  
})

exports.getCurrentUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        return res.status(200).json({user : user , url : `/profile/${user._id}`})
    } catch (error) {
        throw new Error('Cant get current User')
    }
})

exports.getUser = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!userId) return res.status(400).send("no user id");
    try {
      const user = await User.findById(userId)
      const userPins = await Pin.find({userId : user._id})
      return res.status(200).json({user: user, pins : userPins, url : `/user/${user._id}`})
    } catch (error) {
      res.status(500)
      throw new Error('cant get a user')
    }
})

exports.addToSavedPins = asyncHandler(async(req, res) => {
    const {pin} = req.body;
    if(!pin) return res.status(400).send("no pin selected")
      try {
        const user = await User.findById(req.user.userId);
        user.savesPins.push(pin)
        await user.save()
        return res.status(200).json(user.savesPins)
      } catch (error) {
          res.status(500)
          throw new Error('cant add to saved pin')
      }
})

exports.getSavedPins = asyncHandler(async(req, res) => {
    try {
      const user = await User.findById(req.user.userId);    
      return res.status(200).json(user.savesPins)
    } catch (error) {
      res.status(500)
      throw new Error("cant get saved pins")
    }
})

exports.removeSavedPin = asyncHandler(async(req, res) => {
   const { pin } = req.body;
   if (!pin) return res.status(400).send("no pin selected");
   try {
     const user = await User.findById(req.user.userId);
     const newPinsSaved = user.savesPins.filter(item => pin._id !== item._id)
     user.savesPins = newPinsSaved
     await user.save();
     return res.status(200).send('unsaved pin successfuly');
   } catch (error) {
     res.status(500);
     throw new Error("cant add to saved pin");
   }
})