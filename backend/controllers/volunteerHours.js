const VolunteerHour = require('../models/VolunteerHour');
const Organization = require('../models/Organization');

// @desc    Get all volunteer hours
// @route   GET /api/hours
// @access  Private
exports.getHours = async (req, res, next) => {
  try {
    let query;

    // If user is not admin, only show their own hours
    if (req.user.role !== 'admin') {
      if (req.user.role === 'volunteer') {
        query = VolunteerHour.find({ user: req.user.id });
      } else if (req.user.role === 'organization') {
        // Find organizations owned by this user
        const orgs = await Organization.find({ owner: req.user.id }).select('_id');
        const orgIds = orgs.map(org => org._id);
        
        // Find volunteer hours for these organizations
        query = VolunteerHour.find({ organization: { $in: orgIds } });
      }
    } else {
      query = VolunteerHour.find();
    }

    // Execute query with pagination
    const hours = await query.populate('organization', 'name').populate('user', 'name');

    res.status(200).json({
      success: true,
      count: hours.length,
      data: hours
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single volunteer hour entry
// @route   GET /api/hours/:id
// @access  Private
exports.getHour = async (req, res, next) => {
  try {
    const hour = await VolunteerHour.findById(req.params.id)
      .populate('organization', 'name')
      .populate('user', 'name');

    if (!hour) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer hour record not found'
      });
    }

    // Make sure user is hour owner or admin or organization owner
    if (
      hour.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      // Check if user owns the organization
      const org = await Organization.findById(hour.organization);
      if (!org || org.owner.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this record'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: hour
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create volunteer hour entry
// @route   POST /api/hours
// @access  Private (volunteer)
exports.createHour = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if organization exists
    const organization = await Organization.findById(req.body.organization);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const hour = await VolunteerHour.create(req.body);

    res.status(201).json({
      success: true,
      data: hour
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update volunteer hour entry
// @route   PUT /api/hours/:id
// @access  Private (volunteer, admin)
exports.updateHour = async (req, res, next) => {
  try {
    let hour = await VolunteerHour.findById(req.params.id);

    if (!hour) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer hour record not found'
      });
    }

    // Volunteers can only update their own records, and only if status is pending
    if (req.user.role === 'volunteer') {
      if (hour.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to update this record'
        });
      }
      
      if (hour.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Cannot update hours that have been approved or rejected'
        });
      }
    }

    // Organizations can only update status of records for their org
    if (req.user.role === 'organization') {
      const org = await Organization.findById(hour.organization);
      if (!org || org.owner.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to update this record'
        });
      }

      // Organizations can only update status field
      if (Object.keys(req.body).some(key => key !== 'status')) {
        return res.status(400).json({
          success: false,
          error: 'Organizations can only update the status field'
        });
      }

      // If status is being updated to approved, add approver info
      if (req.body.status === 'approved') {
        req.body.approvedBy = req.user.id;
        req.body.approvedAt = Date.now();
      }
    }

    hour = await VolunteerHour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: hour
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete volunteer hour entry
// @route   DELETE /api/hours/:id
// @access  Private (volunteer, admin)
exports.deleteHour = async (req, res, next) => {
  try {
    const hour = await VolunteerHour.findById(req.params.id);

    if (!hour) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer hour record not found'
      });
    }

    // Make sure user is record owner or admin
    if (hour.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this record'
      });
    }

    // Volunteers can only delete pending records
    if (req.user.role === 'volunteer' && hour.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete hours that have been approved or rejected'
      });
    }

    await VolunteerHour.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 