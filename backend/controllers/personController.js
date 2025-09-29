const Person = require("../models/Person");

const personController = {
  // Get all persons
  getAllPersons: async (req, res) => {
    try {
      const persons = await Person.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: persons,
        count: persons.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching persons",
        error: error.message
      });
    }
  },

  // Get single person by ID
  getPersonById: async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);

      if (!person) {
        return res.status(404).json({
          success: false,
          message: "Person not found"
        });
      }

      res.status(200).json({
        success: true,
        data: person
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching person",
        error: error.message
      });
    }
  },

  // Create new person
  createPerson: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, address } = req.body;

      // Check if person with email already exists
      const existingPerson = await Person.findOne({ email });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "Person with this email already exists"
        });
      }

      const person = new Person({
        firstName,
        lastName,
        email,
        phone,
        address
      });

      const savedPerson = await person.save();

      res.status(201).json({
        success: true,
        message: "Person created successfully",
        data: savedPerson
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error creating person",
        error: error.message
      });
    }
  },

  // Update person
  updatePerson: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, address } = req.body;

      // Check if email is being changed and if it already exists
      if (email) {
        const existingPerson = await Person.findOne({
          email,
          _id: { $ne: req.params.id }
        });
        if (existingPerson) {
          return res.status(400).json({
            success: false,
            message: "Person with this email already exists"
          });
        }
      }

      const person = await Person.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          email,
          phone,
          address,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );

      if (!person) {
        return res.status(404).json({
          success: false,
          message: "Person not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Person updated successfully",
        data: person
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error updating person",
        error: error.message
      });
    }
  },

  // Delete person
  deletePerson: async (req, res) => {
    try {
      const person = await Person.findByIdAndDelete(req.params.id);

      if (!person) {
        return res.status(404).json({
          success: false,
          message: "Person not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Person deleted successfully",
        data: person
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting person",
        error: error.message
      });
    }
  }
};

module.exports = { personController };