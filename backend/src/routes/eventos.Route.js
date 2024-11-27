const express = require("express");
const { getEvents, saveEvent, updateEvent, deleteEvent } = require("../controllers/eventos.Controller");

const router = express.Router();

router.get("/get_events", getEvents);
router.post("/save_event", saveEvent);
router.put("/update_event", updateEvent);
router.delete("/delete_event", deleteEvent);

module.exports = router
