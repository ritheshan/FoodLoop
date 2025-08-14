class ApiConstants {
  //enulator url
  // static const String baseUrl = 'http://10.0.2.2:5000/api';

  // static const String baseUrl = 'http://192.168.123.198:5000/api';

  // hosted URL
  static const String baseUrl = 'https://foodloop-72do.onrender.com/api';

  //auth urls
  static const String baseAuthUrl = '$baseUrl/auth';
  static const String login = '$baseAuthUrl/login';
  static const String signUp = '$baseAuthUrl/signup';

  // user urls
  static const String user = '$baseUrl/user';
  static const String userProfile = '$user/profile';

  // donation urls
  static const String donationBaseUrl = '$baseUrl/donations';
  static const String createDonation = '$donationBaseUrl/create';
  static const String listDonations = '$donationBaseUrl/list';
  static const String myDonations = '$donationBaseUrl/my';

  static const String donationTransaction = '$baseUrl/transaction';
  static const String donationTransactionCreate = '$donationTransaction/create';

  static const String claimDonation = '$donationBaseUrl/claim';

  static const String impactUrl = '$baseUrl/impact';
  static const String impactStatistics = '$baseUrl/impact/stats';

  static const String joyLoopUrl = '$baseUrl/joyloop';
  static const String joyMoments = '$joyLoopUrl/joy-moments';
  static const String joySpreaders = '$joyLoopUrl/joy-spreaders';
  static const String topDonors = '$joyLoopUrl/top-donors';
  static const String joyPost = '$joyLoopUrl/post';
  static const String joyGet = '$joyLoopUrl/get';

  // Add these constants
  static const String userTransactions = '$baseUrl/api/transactions/user';
  static const String ngoClaimDonation = '$baseUrl/api/ngo/claim';
}
