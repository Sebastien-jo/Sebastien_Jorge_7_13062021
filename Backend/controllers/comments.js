  
// import

const models = require("../models");
const fs = require("fs");


// Création d'un commentaire
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


// Suppression d'un commentaire

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
