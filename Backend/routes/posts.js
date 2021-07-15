// Imports
const express = require("express");
const postsCtrl = require("../controllers/posts");
const commentCtrl = require("../controllers/comments")
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();

// Routes posts
router.post("/",auth, multer, postsCtrl.createPost);
router.get("/getPosts", auth, multer, postsCtrl.getAllPosts);
router.get("/:id", auth, postsCtrl.getOnePost);
router.delete("/:id", auth, multer, postsCtrl.deletePost);
router.put("/:id/moderate", postsCtrl.moderatePost);
router.put("/:id", auth, postsCtrl.updatePost)

// Routes comments
router.post("/comment", auth,commentCtrl.createComment);
router.get("/:id/comments", auth, commentCtrl.getComments);
router.delete("/comment", auth, commentCtrl.deleteComment);
module.exports = router;