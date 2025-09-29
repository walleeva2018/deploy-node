const express = require("express");
const { personController } = require("../controllers/personController");

const router = express.Router();

// GET /api/persons - Get all persons
router.get("/api/persons", personController.getAllPersons);

// GET /api/persons/:id - Get single person by ID
router.get("/api/persons/:id", personController.getPersonById);

// POST /api/persons - Create new person
router.post("/api/persons", personController.createPerson);

// PUT /api/persons/:id - Update person
router.put("/api/persons/:id", personController.updatePerson);

// DELETE /api/persons/:id - Delete person
router.delete("/api/persons/:id", personController.deletePerson);

module.exports = router;