const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload')
const user_controller = require('../controllers/user_controller');
const pin_controller = require('../controllers/pin_controller')
const comment_controller =require('../controllers/comment_controller')
//user routes
router.route('/auth/register').post(user_controller.register);
router.route("/auth/login").post(user_controller.login);
router.route('/profile').post(authenticate ,upload.single('avatar') ,user_controller.updateProfile)
router.route('/user').get(authenticate , user_controller.getCurrentUser)
router.route('/user/:userId').get(authenticate , user_controller.getUser)
router.route('/pin/save').put(authenticate, user_controller.addToSavedPins)
router.route("/pin/unsave/").put(authenticate, user_controller.removeSavedPin);
router.route('/pin/save/get').get(authenticate , user_controller.getSavedPins)

//pin routes
router.route('/create-pin').post(authenticate , upload.single('img_url') , pin_controller.createPin)
router.route('/pins').get(authenticate , pin_controller.getPins)
router.route('/pin/user').get(authenticate , pin_controller.getUserPins);
router.route('/pin/:pinId').get(authenticate , pin_controller.getPin);
router.route('/pin/delete/:pinId').delete(authenticate , pin_controller.deletePin)
router.route('/pin/update/:pinId').post(authenticate , pin_controller.updatePin)
// comment routes
router.route("/comment").post(authenticate,comment_controller.createComment);
router.route("/pin-comments").get(authenticate, comment_controller.getPinComments);
router.route('/comment/remove').delete(authenticate ,comment_controller.deleteComment)

module.exports = router