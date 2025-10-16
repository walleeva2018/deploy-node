const Person = require("../models/Person");
const { getCastesByReligion, getAllReligions } = require("../data/religionCasteData");

const personController = {
  // Get all religions
  getAllReligions: async (req, res) => {
    try {
      const religions = getAllReligions();
      res.status(200).json({
        success: true,
        data: religions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching religions",
        error: error.message
      });
    }
  },

  // Get castes by religion
  getCastesByReligion: async (req, res) => {
    try {
      const { religion } = req.params;

      if (!religion) {
        return res.status(400).json({
          success: false,
          message: "Religion parameter is required"
        });
      }

      const castes = getCastesByReligion(religion);

      if (castes.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Religion not found"
        });
      }

      res.status(200).json({
        success: true,
        data: castes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching castes",
        error: error.message
      });
    }
  },

  // Get persons by religion and/or caste
  getPersonsByReligionCaste: async (req, res) => {
    try {
      const { religion, caste } = req.query;

      // Build filter object dynamically
      const filter = {};
      if (religion) {
        filter.religion = religion;
      }
      if (caste) {
        filter.caste = caste;
      }

      // If no filters provided, return error
      if (Object.keys(filter).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide at least one filter parameter (religion or caste)"
        });
      }

      const persons = await Person.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: persons,
        count: persons.length,
        filter: filter
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching persons by filter",
        error: error.message
      });
    }
  },

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
      const { firstName, lastName, email, phone, address, religion, caste } = req.body;

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
        address,
        religion,
        caste
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
      const { firstName, lastName, email, phone, address, religion, caste } = req.body;

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
          religion,
          caste,
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