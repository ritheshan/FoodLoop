import GroupDonation from '../models/groupDonation.model.js';
import FoodListing from '../models/listing.model.js';
import User from '../models/user.model.js';

// 1. Create group
export const createGroupDonation = async (req, res) => {
  try {
    const { name, listingIds } = req.body;

    const group = await GroupDonation.create({
      name,
      creator: req.user._id,
      members: [req.user._id],
      listings: listingIds,
      timeline: [{ status: 'created', by: 'system' }]
    });

    res.status(201).json({ message: 'Group donation created', group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// 2. Join group
export const joinGroupDonation = async (req, res) => {
  try {
    const group = await GroupDonation.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      group.timeline.push({ status: 'member joined', by: req.user._id.toString() });
      await group.save();
    }

    res.status(200).json({ message: 'Joined group', group });
  } catch (err) {
    res.status(500).json({ error: 'Error joining group' });
  }
};

// 3. Optimize route (simulate for now)
export const optimizeGroupRoute = async (req, res) => {
  try {
    const group = await GroupDonation.findById(req.params.id).populate('listings');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Dummy optimization
    const route = group.listings.map(listing => listing.location.coordinates);

    group.route = route;
    group.timeline.push({ status: 'route optimized', by: 'system' });
    await group.save();

    res.status(200).json({ message: 'Route optimized', route });
  } catch (err) {
    res.status(500).json({ error: 'Error optimizing route' });
  }
};

// 4. Start group donation
export const startGroupDonation = async (req, res) => {
  try {
    const group = await GroupDonation.findById(req.params.id);
    group.status = 'en_route';
    group.timeline.push({ status: 'en_route', by: req.user._id.toString() });
    await group.save();

    res.status(200).json({ message: 'Group pickup started', group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start donation' });
  }
};

// 5. Complete group donation
export const completeGroupDonation = async (req, res) => {
  try {
    const group = await GroupDonation.findById(req.params.id);
    group.status = 'completed';
    group.timeline.push({ status: 'completed', by: req.user._id.toString() });
    await group.save();

    res.status(200).json({ message: 'Group donation completed', group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete donation' });
  }
};

// 6. Get group details
export const getGroupDetails = async (req, res) => {
  try {
    const group = await GroupDonation.findById(req.params.id)
      .populate('members', 'name role')
      .populate('listings')
      .lean();

    res.status(200).json({ group });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch group' });
  }
};
 