import * as express from "express";

const router = express.Router();

const ROOMS = [
  {
    title: "Global Chatroom",
    id: "1",
  },
];

router.get("/", (req, res) => {
  res.json(ROOMS);
});

export default router
