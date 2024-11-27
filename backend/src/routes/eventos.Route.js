const express = require("express");
const { getEvents, saveEvent, updateEvent, deleteEvent } = require("../controllers/eventos.Controller");

const router = express.Router();

router.get("/eventos:", getEvents);
router.post("/eventos:", saveEvent);
router.put("/eventos", updateEvent);
router.delete("/eventos", deleteEvent);

module.exports = router
