import axios from 'axios';
import Camp from '../models/reliefCamp.model.js';
import User from '../models/user.model.js';

// Helper to notify nearby NGOs & volunteers
const notifyNearbyUsers = async (location, notification) => {
  const nearby = await User.find({
    location: {
      $near: {
        $geometry: location,
        $maxDistance: 10000, // 10 km radius
      }
    },
    role: { $in: ['NGO', 'volunteer', 'donor'] }
  });

  // TODO: replace console.log with real email/SMS/push
  nearby.forEach(u =>
    console.log(`Notify ${u.name} (${u.email}): ${notification}`)
  );
};

/**
 * POST /api/relief-camps
 */
export const createReliefCamp = async (req, res) => {
  try {
    // 1) call AI‐forecast service
    const { eventType, location, startDate, resourcesNeeded } = req.body;
    const forecast = await axios.post('http://localhost:8000/forecast', {
      type: eventType,
      location
    });

    // 2) save camp
    const camp = await Camp.create({
      eventType,
      location,
      startDate,
      resourcesNeeded,
      createdBy: req.user._id,
      demandPrediction: forecast.data.estimated_demand
    });

    // 3) notify
    notifyNearbyUsers(location, `New relief camp for ${eventType} starting ${startDate}`);

    return res.status(201).json({ success: true, camp });
  } catch (err) {
    console.error('createReliefCamp:', err);
    return res.status(500).json({ error: 'Error creating relief camp' });
  }
};

/**
 * GET /api/relief-camps
 */
export const getAllReliefCamps = async (req, res) => {
  try {
    const camps = await Camp.find()
      .sort({ startDate: -1 })
      .populate('createdBy', 'name email')
      .lean();

    return res.json({ success: true, camps });
  } catch (err) {
    console.error('getAllReliefCamps:', err);
    return res.status(500).json({ error: 'Error fetching relief camps' });
  }
};

/**
 * GET /api/relief-camps/:id
 */
export const getReliefCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!camp) {
      return res.status(404).json({ success: false, error: 'Relief camp not found' });
    }
    return res.json({ success: true, camp });
  } catch (err) {
    console.error('getReliefCampById:', err);
    return res.status(500).json({ error: 'Error fetching relief camp' });
  }
};

/**
 * PATCH /api/relief-camps/:id
 */
export const updateReliefCamp = async (req, res) => {
  try {
    const updates = req.body;
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, error: 'Relief camp not found' });
    }

    // apply updates only to allowed fields
    ['eventType','startDate','resourcesNeeded','demandPrediction'].forEach(field => {
      if (updates[field] !== undefined) {
        camp[field] = updates[field];
      }
    });
    await camp.save();

    // Optionally re‐notify if location or startDate changed
    if (updates.location) {
      notifyNearbyUsers(camp.location, `Relief camp updated: new location`);
    }

    return res.json({ success: true, camp });
  } catch (err) {
    console.error('updateReliefCamp:', err);
    return res.status(500).json({ error: 'Error updating relief camp' });
  }
};

/**
 * DELETE /api/relief-camps/:id
 */
export const deleteReliefCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, error: 'Relief camp not found' });
    }
    return res.json({ success: true, message: 'Relief camp deleted' });
  } catch (err) {
    console.error('deleteReliefCamp:', err);
    return res.status(500).json({ error: 'Error deleting relief camp' });
  }
};
