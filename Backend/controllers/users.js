const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");

exports.signup = async (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const password = req.body.password;

	//const firstName_regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
	//const lastName_regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
	const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const password_regex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
	

	// On cherche l'utilisateur dans la bdd

	try {
		if ( !firstName || !lastName || !email || !password) {
			throw new Error("Missing parameters");
		}

		if (!email_regex.test(email)) {
			throw new Error("Wrong email format");
		}

		if (!password_regex.test(password)) {
			throw new Error(
				"-At least 8 characters long - Include at least 1 lowercase letter - 1 capital letter - 1 number - 1 special character = !@#$%^&*"
			);
		}

		const oldUser = await models.User.findOne({
			attributes: ["email"],
			where: { email: email}
		});
		if (oldUser) {
			throw new Error("Already have an account");
		}

		const newUser = await models.User.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: await bcrypt.hash(password, 10),
			isAdmin:0
		});

		if (!newUser) {
			throw new Error("Sorry,something gone wrong,please try again later");
		}

		const token =
			jwt.sign({ id: newUser.id }, "access_token", { expiresIn: "2H" });

		if (!token) {
			throw new Error("Sorry,something gone wrong,please try again later");
		}

		res.status(201).json({
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			user_id: newUser.id,
			email: newUser.email,
			isAdmin: newUser.isAdmin,
			token
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const user = await models.User.findOne({
			where: {
				email: req.body.email,
			}
		});

		if (!user) {
			throw new Error("Sorry,can't find your account");
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password);

		if (!isMatch) {
			throw new Error("Incorrect password");
		}

		const token =
			 jwt.sign({ id: user.id }, "access_token", { expiresIn: "2h" });
		res.status(200).json({
			user: user,
			token
		});

		if (!token) {
			throw new Error("Something gone wrong try again later");
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.userProfile = async (req, res) => {
	try {
		const user = await models.User.findOne({
			attributes: ["id",  "firstName", "lastName", "email", "isAdmin"],
			where: {
				id: req.user.id
			}
		});

		if (!user) {
			throw new Error("Sorry,can't find your account");
		}
		res.status(200).json({ user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.deleteProfile = async (req, res) => {
	try {
		const userToFind = await models.User.findOne({
			where: { id: req.user.id }
		});
		if (!userToFind) {
			throw new Error("Sorry,can't find your account");
		}

		res.status(200).json({
			message: "Your account has been successfully deleted"
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const userToFind = await models.User.findOne({
			attributes: ["id", "isAdmin", "email"],
			where: { id: req.user.id }
		});

		if (!userToFind) {
			throw new Error("Sorry,we can't find your account");
		}

		const userToUpdate = await models.User.update(
			{
				email: req.body.email,
				isAdmin: req.body.isAdmin
			},
			{
				where: { id: req.user.id }
			}
		);

		if (!userToUpdate) {
			throw new Error("Sorry,something gone wrong,please try again later");
		}
		res.status(200).json({
			user: userToUpdate.isAdmin,
			message: "Your account has been update"
		});

		if (!userToUpdate) {
			throw new Error("Sorry,we can't update your account");
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

