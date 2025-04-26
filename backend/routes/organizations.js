const express = require('express');
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizations');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getOrganizations)
  .post(protect, authorize('admin', 'organization'), createOrganization);

router
  .route('/:id')
  .get(getOrganization)
  .put(protect, authorize('admin', 'organization'), updateOrganization)
  .delete(protect, authorize('admin', 'organization'), deleteOrganization);

module.exports = router; 