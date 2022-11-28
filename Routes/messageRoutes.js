const express = require("express");
const router = express.Router();
const { protect } = require("../MiddleWare/authMiddleWare");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
