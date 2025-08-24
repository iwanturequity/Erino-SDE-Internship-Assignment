const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Helper function to build filter query
const buildFilterQuery = (filters) => {
  const query = {};

  Object.keys(filters).forEach(field => {
    const filter = filters[field];
    if (!filter || (typeof filter === 'object' && Object.keys(filter).length === 0)) return;

    switch (field) {
      case 'email':
      case 'company':
      case 'city':
      case 'first_name':
      case 'last_name':
        if (filter.operator === 'equals') {
          query[field] = filter.value;
        } else if (filter.operator === 'contains') {
          query[field] = new RegExp(filter.value, 'i');
        }
        break;

      case 'status':
      case 'source':
        if (filter.operator === 'equals') {
          query[field] = filter.value;
        } else if (filter.operator === 'in') {
          query[field] = { $in: filter.value };
        }
        break;

      case 'score':
      case 'lead_value':
        if (filter.operator === 'equals') {
          query[field] = filter.value;
        } else if (filter.operator === 'gt') {
          query[field] = { $gt: filter.value };
        } else if (filter.operator === 'lt') {
          query[field] = { $lt: filter.value };
        } else if (filter.operator === 'between') {
          query[field] = { $gte: filter.value.min, $lte: filter.value.max };
        }
        break;

      case 'created_at':
      case 'last_activity_at':
        if (filter.operator === 'on') {
          const startOfDay = new Date(filter.value);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(filter.value);
          endOfDay.setHours(23, 59, 59, 999);
          query[field] = { $gte: startOfDay, $lte: endOfDay };
        } else if (filter.operator === 'before') {
          query[field] = { $lt: new Date(filter.value) };
        } else if (filter.operator === 'after') {
          query[field] = { $gt: new Date(filter.value) };
        } else if (filter.operator === 'between') {
          query[field] = { 
            $gte: new Date(filter.value.start), 
            $lte: new Date(filter.value.end) 
          };
        }
        break;

      case 'is_qualified':
        if (filter.operator === 'equals') {
          query[field] = filter.value;
        }
        break;
    }
  });

  return query;
};

// GET /leads - List leads with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    // Parse filters from query params
    let filters = {};
    if (req.query.filters) {
      try {
        filters = JSON.parse(req.query.filters);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid filters format'
        });
      }
    }

    // Build filter query
    const filterQuery = buildFilterQuery(filters);

    // Get total count for pagination
    const total = await Lead.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limit);

    // Get leads with pagination
    const leads = await Lead.find(filterQuery)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: leads,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leads'
    });
  }
});

// GET /leads/:id - Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error fetching lead'
    });
  }
});

// POST /leads - Create new lead
router.post('/', async (req, res) => {
  try {
    const leadData = req.body;

    // Validate required fields
    if (!leadData.first_name || !leadData.last_name || !leadData.email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if lead with email already exists
    const existingLead = await Lead.findOne({ email: leadData.email });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating lead'
    });
  }
});

// PUT /leads/:id - Update lead
router.put('/:id', async (req, res) => {
  try {
    const leadData = req.body;

    // If email is being updated, check for duplicates
    if (leadData.email) {
      const existingLead = await Lead.findOne({ 
        email: leadData.email, 
        _id: { $ne: req.params.id } 
      });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: 'Lead with this email already exists'
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      leadData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating lead'
    });
  }
});

// DELETE /leads/:id - Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lead ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting lead'
    });
  }
});

module.exports = router;
