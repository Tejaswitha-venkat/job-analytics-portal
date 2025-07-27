const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  AlertPreference,
  saveAlertPreference,
  getAlertPreferencesByUserId,
  updateAlertPreference
} = require('./alert-model');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // In a real app, you'd check session/JWT
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Create a new alert preference
router.post(
  '/',
  isAuthenticated,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('criteria').isObject().withMessage('Search criteria must be an object'),
    body('frequency').isIn(['daily', 'weekly', 'immediate']).withMessage('Frequency must be daily, weekly, or immediate')
  ],
  (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, criteria, frequency } = req.body;
    const userId = req.user.id; // From auth middleware

    // Create and save new alert preference
    const newAlertPreference = new AlertPreference(
      userId,
      email,
      criteria,
      frequency
    );

    const savedPreference = saveAlertPreference(newAlertPreference);
    res.status(201).json(savedPreference);
  }
);

// Get all alert preferences for the current user
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const preferences = getAlertPreferencesByUserId(userId);
  res.json(preferences);
});

// Update an alert preference
router.put('/:id', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const preferenceId = req.params.id;
  const updates = req.body;

  // Prevent updating critical fields
  delete updates.userId;
  delete updates._id;
  delete updates.createdAt;

  const updatedPreference = updateAlertPreference(userId, preferenceId, updates);

  if (!updatedPreference) {
    return res.status(404).json({ error: 'Alert preference not found' });
  }

  res.json(updatedPreference);
});

// Delete (deactivate) an alert preference
router.delete('/:id', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const preferenceId = req.params.id;

  const updatedPreference = updateAlertPreference(userId, preferenceId, { isActive: false });

  if (!updatedPreference) {
    return res.status(404).json({ error: 'Alert preference not found' });
  }

  res.json({ message: 'Alert preference deactivated successfully' });
});

module.exports = router;