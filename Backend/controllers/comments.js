  
// import

const models = require("../models");
const fs = require("fs");

exports.createComment = async (req, res) => {

	try {

		// user
		const findUser = await models.User.findOne({
			attributes: ['email', 'firstName'],
			where: { id: req.user.id },
		});

		if (!findUser) {
			throw new Error("Sorry,we can't find your account");
		}
		// comment
		
		
		const newComment = await models.Comment.create({
			comments: req.body.comments,
			PostId: req.body.PostId,
			UserId: req.user.id,
			
			
		});

		if (!newComment) {
			throw new Error(' Sorry, missing parameters');
		}

		res.status(200).json({ newComment });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
exports.getComments = async (req, res) => {
	try {
		const order = req.query.order;
		const comments = await models.Comment.findAll({
			attributes: [
				"id",
				"comments",
				"UserId",
				"PostId",
				"createdAt",
				"updatedAt"
			],
			order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
			where: { postId: req.params.id },
			include: [{ model: models.User, attributes: ["firstName","lastName"] }]
		});
		if (comments) {
			res.status(200).send({ message: comments });
		} else {
			throw new Error("There are no comments");
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// future project

exports.deleteComment = async (req, res) => {
	try {
		const commentFound = await models.Comment.findOne({
			attributes: [
				"id",
				"comments",
				"UserId",
				"PostId",
				"createdAt",
				"updatedAt"
			],
			where: { id: req.params.id }
		});

		if (!commentFound) {
			throw new Error("Can't find your comment");
		}

		await models.Comment.destroy({
			where: { id: req.params.id }
		});
		res.status(200).json({ message: "Comment has been deleted " });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
