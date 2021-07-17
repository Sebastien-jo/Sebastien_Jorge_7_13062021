const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const auth = require("../middleware/auth");

router.post("/signup", usersCtrl.signup);
router.post("/login", usersCtrl.login);
router.delete("/:id", auth, usersCtrl.deleteProfile);
router.get("/:id", auth, usersCtrl.userProfile);
router.put("/update", auth, usersCtrl.updateProfile);

module.exports = router;