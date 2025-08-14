import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';

export const getUserProfile = async (req, res) => {
  console.log('User profile request received');
  try {
    const userId = req.user._id;
    console.log('User ID:', userId);
    console.log('Role:', req.user.role);

    // Fetch the user details from the database
    const user = await User.findById(userId).lean(); // lean for plain JS object
    console.log('User details:', user.role);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Initialize donation data and donations array
    let totalDonations = 0;
    let averageMonthlyDonations = 0;
    let lastDonationDate = null;
    let donations = [];

    // Fetch donations data for 'donor' role
    if (user.role === 'donor') {

      donations = await Transaction.find({ donor: userId })
  .sort({ createdAt: -1 })
  .populate('foodListing', 'foodType weight')
  .populate('ngo', 'name address organizationName');

      totalDonations = donations.length;
      console.log(donations)

      if (donations.length > 0) {
        const firstDonationDate = donations[donations.length - 1].createdAt;
        const months = Math.max(
          1,
          (new Date().getFullYear() - firstDonationDate.getFullYear()) * 12 +
            (new Date().getMonth() - firstDonationDate.getMonth())
        );

        averageMonthlyDonations = Math.round(totalDonations / months);
        lastDonationDate = donations[0].createdAt;
      }
    }

    // Prepare the response data
    const responseData = {
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        organizationName: user.organizationName,
        contactNumber: user.contactNumber,
        address: user.address,
        website: user.website,
        foodPreferences: user.foodPreferences,
        needsVolunteer: user.needsVolunteer,
        totalDonations,
        averageMonthlyDonations,
        lastDonationDate
      },
      donations: donations.map(donation => ({
        _id: donation._id,
        foodListing: donation.foodListing
          ? {
              foodType: donation.foodListing.foodType,
              weight: donation.foodListing.weight,
              date: donation.createdAt.toLocaleString(),
            }
          : {
              foodType: donation.certificateData?.foodType || "Unknown",
              weight: donation.certificateData?.weight || "Unknown",
              date: donation.createdAt.toLocaleString(),
            },
        ngo: {
          name: donation.ngo?.organizationName || "Unknown NGO",
          address: donation.ngo?.address || "No Address",
        },
        transactionHash: donation.transactionHash,
        certificateData: {
          transactionHash: donation.certificateData?.transactionHash || "Not Available",
          nftTokenId: donation.certificateData?.nftTokenId || "Not Available",
          donorName: donation.certificateData?.donorName || "Anonymous",
          donorEmail: donation.certificateData?.donorEmail || "Hidden",
          foodType: donation.certificateData?.foodType || "Unknown",
          weight: donation.certificateData?.weight || "Unknown",
          location: donation.certificateData?.location || "Unknown",
          timestamp: donation.certificateData?.timestamp || "Not Available",
          date: donation.certificateData?.timestamp
            ? new Date(donation.certificateData.timestamp).toLocaleString()
            : 'Not Available',
        }
      }))
    };

    // Send the response with the data
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id; // Retrieved from auth middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required' });
  }

  try {
    const user = await User.findById(userId).select('+password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};