const express = require("express");
const { getReservations, saveBooking, updateBooking } = require("../controllers/reservas.Controller");

const router = express.Router();

router.get("/reservas", getReservations);
router.post("/reservas", saveBooking);
router.put("/reservas", updateBooking);

module.exports = router
