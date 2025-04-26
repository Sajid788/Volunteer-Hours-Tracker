const Organization = require('../models/Organization');

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public
exports.getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find();

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single organization
// @route   GET /api/organizations/:id
// @access  Public
exports.getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new organization
// @route   POST /api/organizations
// @access  Private (admin, organization)
exports.createOrganization = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    const organization = await Organization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private (admin, organization owner)
exports.updateOrganization = async (req, res, next) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    // Make sure user is organization owner or admin
    if (
      organization.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this organization'
      });
    }

    organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private (admin, organization owner)
exports.deleteOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    // Make sure user is organization owner or admin
    if (
      organization.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this organization'
      });
    }

    await organization.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 