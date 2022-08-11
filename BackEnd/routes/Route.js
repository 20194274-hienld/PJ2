
const express= require('express');
const userController = require('../controller/userController')
const adminController= require('../controller/adminController')
const postController = require('../controller/postController')
const collectionController = require('../controller/collectionController')
const commentController = require('../controller/commentController')
const reportController = require('../controller/reportController')
const router = express.Router();
const checkAdminRole = require('../middleware/checkAdminRole');
const { Router } = require('express');

//user route
router.get('/api/another', userController.getInforAnother)
router.get('/api/get', userController.getAllPost)
router.get('/api/user', userController.getInfor)
router.get('/api/follow', userController.getListFollow)
router.post('/api/register', userController.register)
router.post('/api/change', userController.changeInfoUser)
router.post('/api/login', userController.login)
router.post('/api/password', userController.changePassword)
router.post('/api/follow', userController.follow)
router.post('/api/unfollow', userController.unfollow)


//report route
// router.post('/api/report', checkAdminRole, reportController.report)
router.get('/api/report', checkAdminRole, reportController.getAllReport)

// post route
router.get('/api/post', postController.getPostOwn)
router.get('/api/postanother', postController.getListPostAnother)
router.get('/api/displayPost', postController.getPost)
router.post('/api/list', postController.getListPost)
router.post('/api/post', postController.createPost)
router.post('/api/delete', postController.DeletePost)
router.post('/api/like', postController.like)
router.post('/api/report', postController.reportPost)
router.post('/api/search', postController.getListSearchPost)

// admin route
router.post('/api/admin/login', adminController.loginAdmin)
router.post('/api/admin/post', checkAdminRole, adminController.checkPost)
router.post('/api/admin/user', checkAdminRole, adminController.checkUser)
router.post('/api/admin/delete', checkAdminRole, adminController.deletePost)
router.get('/api/getuser', checkAdminRole, adminController.getAllUser)
router.post('/api/reject', checkAdminRole, adminController.rejectReport)

//  collection route
router.get('/api/collectionid', collectionController.getCollectionByID)
router.get('/api/collection', collectionController.getListCollection)
router.post('/api/collection', collectionController.createCollection)
router.post('/api/collection/addPost', collectionController.addPost)
router.post('/api/collection/deletePost', collectionController.deletePost)
router.post('/api/collection/delete', collectionController.deleteCollection)
router.post('/api/collection/topic', collectionController.editTopicCollection)
router.post('/api/collection/private', collectionController.setPrivate)

// comment route
router.post('/api/comment', commentController.createComment)
router.get('/api/comment', commentController.getCommentInPost)
router.post('/api/comment/edit', commentController.editCommentByOwn)
router.post('/api/comment/delete', commentController.deleteCommentByOwn)
router.post('/api/comment/deleteOwnPost', commentController.deleteCommentByOwnPost)

module.exports = router