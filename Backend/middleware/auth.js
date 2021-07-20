const jwt = require("jsonwebtoken");
const models = require("../models");


//verification du token et récupération des infos de l'utilisateur
module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "access_token");
		const user = await models.User.findOne({ where: { id: decodedToken.id } });
		if (!user) {
			throw new Error("invalid");
		}
		req.user = user;
		next();
	} catch (err) {
		res.status(401).json({ error: "A token must be provided" });
	}
};
