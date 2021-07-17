"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			models.User.hasMany(models.Posts,
					{ foreignKey: "id" },
					{onDelete: "cascade"}
				);
			models.User.hasMany(models.Comment,
					{ foreignKey: "id" },
					{onDelete: "cascade"}
				);
		}
	}
	User.init(
		{
			
        firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true
			}, 
      	lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true
			},

			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				required: true
			},

			password: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true
			},

			isAdmin: {
				type: DataTypes.BOOLEAN
			},
		},
		{
			sequelize,
			modelName: "User"
		}
	);
	return User;
};
