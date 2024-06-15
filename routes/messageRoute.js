import { getAllMessages, sendMessage } from "../controllers/messageController.js";
import express from 'express'
import { isAdminAuthenticated } from "../middleware/auth.js";

const router = express();
router.post('/send',sendMessage)
router.get('/getall',isAdminAuthenticated,getAllMessages)

export default router
