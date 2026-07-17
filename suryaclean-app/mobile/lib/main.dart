import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:intl/intl.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ============================================================
// CONFIGURATION
// ============================================================
const String API_URL = 'http://10.0.2.2:5000'; // Android emulator -> localhost
// For iOS simulator use: 'http://localhost:5000'
// For real device use: 'https://your-api-url.com'
const String RAZORPAY_KEY = 'rzp_test_YOUR_KEY_ID';

// ============================================================
// MAIN APP
// ============================================================
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const SuryaCleanApp());
}

class SuryaCleanApp extends StatelessWidget {
  const SuryaCleanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SuryaClean',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFFF5A623),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFF5A623)),
        fontFamily: 'Poppins',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1B2A4A),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const AuthGate(),
    );
  }
}

// ============================================================
// AUTH GATE
// ============================================================
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        if (snapshot.hasData) {
          return const MainShell();
        }
        return const LoginScreen();
      },
    );
  }
}

// ============================================================
// LOGIN SCREEN
// ============================================================
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _loading = false;

  Future<void> _signInWithGoogle() async {
    setState(() => _loading = true);
    try {
      final googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return;

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await FirebaseAuth.instance.signInWithCredential(credential);
      final idToken = await userCredential.user!.getIdToken();

      // Sync with backend
      await http.post(
        Uri.parse('$API_URL/api/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'idToken': idToken}),
      );

      if (mounted) {
        Fluttertoast.showToast(msg: 'Welcome to SuryaClean! ☀️');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Login failed: $e');
    }
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1B2A4A), Color(0xFF2d4a7a)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.wb_sunny, size: 80, color: Color(0xFFF5A623)),
                  const SizedBox(height: 16),
                  const Text(
                    'SuryaClean',
                    style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const Text(
                    'Har Panel, Har Din, Chamakdaar',
                    style: TextStyle(fontSize: 16, color: Color(0xFFF5A623)),
                  ),
                  const SizedBox(height: 48),
                  const Text(
                    'Professional Solar Panel Cleaning.\nBook, Pay, and Track — all from your phone.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _loading ? null : _signInWithGoogle,
                      icon: Image.asset('assets/google_logo.png', width: 20, errorBuilder: (_, __, ___) => const Icon(Icons.login)),
                      label: Text(_loading ? 'Signing in...' : 'Sign in with Google'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black87,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// MAIN SHELL (BOTTOM NAVIGATION)
// ============================================================
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;
  final List<Widget> _screens = [
    const HomeScreen(),
    const BookScreen(),
    const AMCScreen(),
    const DashboardScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFFF5A623),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_month), label: 'Book'),
          BottomNavigationBarItem(icon: Icon(Icons.card_membership), label: 'AMC'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account'),
        ],
      ),
    );
  }
}

// ============================================================
// HOME SCREEN
// ============================================================
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [const Icon(Icons.wb_sunny, color: Color(0xFFF5A623)), const SizedBox(width: 8), const Text('SuryaClean')]),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await GoogleSignIn().signOut();
              await FirebaseAuth.instance.signOut();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFF1B2A4A), Color(0xFF2d4a7a)])),
              child: Column(
                children: [
                  CircleAvatar(radius: 30, backgroundColor: Colors.white24, child: Text(user?.displayName?[0] ?? 'S', style: const TextStyle(fontSize: 24, color: Colors.white))),
                  const SizedBox(height: 12),
                  Text('Welcome, ${user?.displayName ?? 'User'}!', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  const Text('Dirty panels lose 15-30% power.\nWe make them shine! ✨', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 20),
                  ElevatedButton(onPressed: () {}, child: const Text('Book Free Demo'), style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF5A623), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)))),
                ],
              ),
            ),

            // Pricing Quick View
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('Quick Pricing', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1B2A4A))),
            ),
            SizedBox(
              height: 160,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: [
                  _priceCard('1-2 kW', '3-6 panels', '₹499'),
                  _priceCard('3-5 kW', '9-15 panels', '₹899', featured: true),
                  _priceCard('6-10 kW', '18-30 panels', '₹1,499'),
                  _priceCard('10+ kW', '30+ panels', '₹2,499'),
                ],
              ),
            ),

            // Features
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('Why SuryaClean?', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1B2A4A))),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(spacing: 12, runSpacing: 12, children: [
                _featureChip(Icons.shield, '100% Insured'),
                _featureChip(Icons.phone_android, 'App-Based'),
                _featureChip(Icons.water_drop, 'Water-Efficient'),
                _featureChip(Icons.verified_user, 'Trained Workers'),
                _featureChip(Icons.camera_alt, 'Photo Reports'),
                _featureChip(Icons.support_agent, 'Hinglish Support'),
              ]),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _priceCard(String size, String panels, String price, {bool featured = false}) {
    return Container(
      width: 140,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: featured ? const Color(0xFFF5A623) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: featured ? const Color(0xFFF5A623) : Colors.grey.shade200),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(size, style: TextStyle(fontWeight: FontWeight.bold, color: featured ? Colors.white : const Color(0xFF1B2A4A))),
          Text(panels, style: TextStyle(fontSize: 12, color: featured ? Colors.white70 : Colors.grey)),
          const SizedBox(height: 8),
          Text(price, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: featured ? Colors.white : const Color(0xFFF5A623))),
        ],
      ),
    );
  }

  Widget _featureChip(IconData icon, String label) {
    return Chip(avatar: Icon(icon, size: 18, color: const Color(0xFFF5A623)), label: Text(label, style: const TextStyle(fontSize: 13)), backgroundColor: Colors.grey.shade50);
  }
}

// ============================================================
// BOOK SCREEN
// ============================================================
class BookScreen extends StatefulWidget {
  const BookScreen({super.key});

  @override
  State<BookScreen> createState() => _BookScreenState();
}

class _BookScreenState extends State<BookScreen> {
  final _formKey = GlobalKey<FormState>();
  String _systemSize = '3-5kW';
  final _addressCtrl = TextEditingController();
  String _city = 'Faridabad';
  DateTime? _scheduledDate;
  String _scheduledTime = '09:00 AM - 10:00 AM';
  final _notesCtrl = TextEditingController();
  bool _loading = false;

  final Map<String, int> _prices = {'1-2kW': 499, '3-5kW': 899, '6-10kW': 1499, '10+kW': 2499};
  final List<String> _timeSlots = ['07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'];

  Future<String?> _getToken() async {
    final user = FirebaseAuth.instance.currentUser;
    return user?.getIdToken();
  }

  Future<void> _bookAndPay() async {
    if (!_formKey.currentState!.validate() || _scheduledDate == null) {
      Fluttertoast.showToast(msg: 'Please fill all required fields');
      return;
    }
    setState(() => _loading = true);
    try {
      final token = await _getToken();
      final amount = _prices[_systemSize] ?? 899;

      // Create booking
      final res = await http.post(
        Uri.parse('$API_URL/api/bookings'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
        body: jsonEncode({
          'serviceId': 'one-time',
          'systemSize': _systemSize,
          'address': '${_addressCtrl.text}, $_city',
          'scheduledDate': DateFormat('yyyy-MM-dd').format(_scheduledDate!),
          'scheduledTime': _scheduledTime,
          'notes': _notesCtrl.text,
          'amount': amount,
        }),
      );
      final data = jsonDecode(res.body);
      if (data['error'] != null) throw Exception(data['error']);

      final bookingId = data['booking']['bookingId'];

      // Create payment order
      final payRes = await http.post(
        Uri.parse('$API_URL/api/payments/create-order'),
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
        body: jsonEncode({'amount': amount, 'bookingId': bookingId}),
      );
      final payData = jsonDecode(payRes.body);

      // Open Razorpay
      final razorpay = Razorpay();
      razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (paymentResponse) async {
        // Verify
        final verifyRes = await http.post(
          Uri.parse('$API_URL/api/payments/verify'),
          headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
          body: jsonEncode({
            'razorpay_order_id': payData['orderId'],
            'razorpay_payment_id': paymentResponse.paymentId,
            'razorpay_signature': paymentResponse.signature,
            'bookingId': bookingId,
          }),
        );
        Fluttertoast.showToast(msg: 'Booking confirmed! ✅');
      });
      razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, (e) {
        Fluttertoast.showToast(msg: 'Payment failed. Booking saved as pending.');
      });

      var options = {
        'key': RAZORPAY_KEY,
        'amount': payData['amount'],
        'name': 'SuryaClean',
        'description': 'Solar Panel Cleaning - $_systemSize',
        'order_id': payData['orderId'],
        'prefill': {'name': FirebaseAuth.instance.currentUser?.displayName, 'email': FirebaseAuth.instance.currentUser?.email},
        'theme': {'color': '#F5A623'},
      };
      razorpay.open(options);
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: $e');
    }
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final price = _prices[_systemSize] ?? 899;
    return Scaffold(
      appBar: AppBar(title: const Text('Book a Cleaning')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                value: _systemSize,
                decoration: const InputDecoration(labelText: 'System Size', border: OutlineInputBorder()),
                items: _prices.keys.map((k) => DropdownMenuItem(value: k, child: Text(k))).toList(),
                onChanged: (v) => setState(() => _systemSize = v!),
              ),
              const SizedBox(height: 16),
              TextFormField(controller: _addressCtrl, decoration: const InputDecoration(labelText: 'Full Address', border: OutlineInputBorder()), maxLines: 2, validator: (v) => v!.isEmpty ? 'Required' : null),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _city,
                decoration: const InputDecoration(labelText: 'City', border: OutlineInputBorder()),
                items: ['Faridabad', 'Ballabgarh', 'Palwal', 'Gurgaon', 'Noida', 'South Delhi'].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (v) => setState(() => _city = v!),
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  final d = await showDatePicker(context: context, initialDate: DateTime.now().add(const Duration(days: 1)), firstDate: DateTime.now().add(const Duration(days: 1)), lastDate: DateTime.now().add(const Duration(days: 60)));
                  if (d != null) setState(() => _scheduledDate = d);
                },
                child: InputDecorator(
                  decoration: const InputDecoration(labelText: 'Date', border: OutlineInputBorder()),
                  child: Text(_scheduledDate != null ? DateFormat('dd MMM yyyy').format(_scheduledDate!) : 'Tap to select'),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _scheduledTime,
                decoration: const InputDecoration(labelText: 'Time Slot', border: OutlineInputBorder()),
                items: _timeSlots.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (v) => setState(() => _scheduledTime = v!),
              ),
              const SizedBox(height: 16),
              TextFormField(controller: _notesCtrl, decoration: const InputDecoration(labelText: 'Notes (optional)', border: OutlineInputBorder()), maxLines: 2),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text('Total: $_systemSize', style: const TextStyle(fontSize: 14)),
                  Text('₹$price', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFFF5A623))),
                ]),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _bookAndPay,
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF5A623), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: Text(_loading ? 'Processing...' : 'Pay ₹$price & Confirm'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ============================================================
// AMC SCREEN
// ============================================================
class AMCScreen extends StatefulWidget {
  const AMCScreen({super.key});

  @override
  State<AMCScreen> createState() => _AMCScreenState();
}

class _AMCScreenState extends State<AMCScreen> {
  String _systemSize = '3-5kW';
  final _addressCtrl = TextEditingController();
  String _city = 'Faridabad';
  DateTime? _startDate;
  bool _loading = false;

  final Map<String, List<Map<String, dynamic>>> _plans = {
    '3-5kW': [
      {'id': 'amc-basic', 'name': 'Basic', 'visits': 2, 'price': 1599},
      {'id': 'amc-standard', 'name': 'Standard ⭐', 'visits': 4, 'price': 2999},
      {'id': 'amc-premium', 'name': 'Premium', 'visits': 6, 'price': 4999},
    ],
    '6-10kW': [
      {'id': 'amc-basic', 'name': 'Basic', 'visits': 2, 'price': 2499},
      {'id': 'amc-standard', 'name': 'Standard ⭐', 'visits': 4, 'price': 4499},
      {'id': 'amc-premium', 'name': 'Premium', 'visits': 6, 'price': 6999},
    ],
  };

  Future<void> _subscribe(Map<String, dynamic> plan) async {
    if (_addressCtrl.text.isEmpty || _startDate == null) {
      Fluttertoast.showToast(msg: 'Please enter address and start date');
      return;
    }
    setState(() => _loading = true);
    try {
      final token = await FirebaseAuth.instance.currentUser?.getIdToken();
      final amcRes = await http.post(Uri.parse('$API_URL/api/amc/subscribe'), headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: jsonEncode({'planId': plan['id'], 'systemSize': _systemSize, 'address': '${_addressCtrl.text}, $_city', 'startDate': DateFormat('yyyy-MM-dd').format(_startDate!), 'amount': plan['price']}));
      final data = jsonDecode(amcRes.body);
      if (data['error'] != null) throw Exception(data['error']);

      final payRes = await http.post(Uri.parse('$API_URL/api/payments/create-order'), headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'}, body: jsonEncode({'amount': plan['price'], 'amcId': data['amc']['amcId']}));
      final payData = jsonDecode(payRes.body);

      final razorpay = Razorpay();
      razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (_) => Fluttertoast.showToast(msg: 'AMC Activated! ✅'));
      razorpay.open({'key': RAZORPAY_KEY, 'amount': payData['amount'], 'name': 'SuryaClean AMC', 'description': '${plan['name']} - $_systemSize', 'order_id': payData['orderId'], 'prefill': {'name': FirebaseAuth.instance.currentUser?.displayName, 'email': FirebaseAuth.instance.currentUser?.email}, 'theme': {'color': '#F5A623'}});
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: $e');
    }
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final plans = _plans[_systemSize] ?? _plans['3-5kW']!;
    return Scaffold(
      appBar: AppBar(title: const Text('AMC Plans')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButtonFormField<String>(value: _systemSize, decoration: const InputDecoration(labelText: 'System Size', border: OutlineInputBorder()), items: _plans.keys.map((k) => DropdownMenuItem(value: k, child: Text(k))).toList(), onChanged: (v) => setState(() => _systemSize = v!)),
            const SizedBox(height: 12),
            TextFormField(controller: _addressCtrl, decoration: const InputDecoration(labelText: 'Address', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(value: _city, decoration: const InputDecoration(labelText: 'City', border: OutlineInputBorder()), items: ['Faridabad', 'Ballabgarh', 'Palwal', 'Gurgaon', 'Noida'].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(), onChanged: (v) => setState(() => _city = v!)),
            const SizedBox(height: 12),
            InkWell(
              onTap: () async {
                final d = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 90)));
                if (d != null) setState(() => _startDate = d);
              },
              child: InputDecorator(decoration: const InputDecoration(labelText: 'Start Date', border: OutlineInputBorder()), child: Text(_startDate != null ? DateFormat('dd MMM yyyy').format(_startDate!) : 'Tap to select')),
            ),
            const SizedBox(height: 24),
            ...plans.map((plan) => Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: plan['id'] == 'amc-standard' ? const Color(0xFFF5A623) : Colors.grey.shade200, width: plan['id'] == 'amc-standard' ? 2 : 1)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Text(plan['name'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        Text('${plan['visits']} visits/year', style: const TextStyle(color: Colors.grey)),
                        const SizedBox(height: 8),
                        Text('₹${plan['price']}/year', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFF5A623))),
                        Text('₹${(plan['price'] / 12).round()}/month', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 12),
                        SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _loading ? null : () => _subscribe(plan), style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF5A623), foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), child: Text('Subscribe — ₹${plan['price']}'))),
                      ],
                    ),
                  ),
                )),
          ],
        ),
      ),
    );
  }
}

// ============================================================
// DASHBOARD SCREEN
// ============================================================
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List _bookings = [], _amcs = [], _transactions = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _loading = true);
    try {
      final token = await FirebaseAuth.instance.currentUser?.getIdToken();
      final headers = {'Authorization': 'Bearer $token'};
      final [b, a, t] = await Future.wait([
        http.get(Uri.parse('$API_URL/api/bookings'), headers: headers),
        http.get(Uri.parse('$API_URL/api/amc'), headers: headers),
        http.get(Uri.parse('$API_URL/api/transactions'), headers: headers),
      ]);
      if (mounted) {
        setState(() {
          _bookings = List.from(jsonDecode(b.body) ?? []);
          _amcs = List.from(jsonDecode(a.body) ?? []);
          _transactions = List.from(jsonDecode(t.body) ?? []);
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _statusBadge(String status) {
    const map = {'pending': '⏳ Pending', 'confirmed': '📋 Confirmed', 'completed': '✅ Done', 'cancelled': '❌ Cancelled', 'active': '✅ Active'};
    return map[status] ?? status;
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    return Scaffold(
      appBar: AppBar(title: Text(user?.displayName ?? 'My Account')),
      body: Column(
        children: [
          Container(color: const Color(0xFF1B2A4A), child: TabBar(controller: _tabController, indicatorColor: const Color(0xFFF5A623), labelColor: Colors.white, unselectedLabelColor: Colors.white54, tabs: const [Tab(text: 'Bookings'), Tab(text: 'AMC'), Tab(text: 'Payments')])),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : TabBarView(
                    controller: _tabController,
                    children: [
                      // Bookings Tab
                      _bookings.isEmpty ? const Center(child: Text('No bookings yet')) : RefreshIndicator(onRefresh: _fetchData, child: ListView.builder(padding: const EdgeInsets.all(12), itemCount: _bookings.length, itemBuilder: (_, i) => Card(child: ListTile(title: Text('${_bookings[i]['bookingId']}'), subtitle: Text('${_bookings[i]['address']}\n${_bookings[i]['scheduledDate']} | ${_bookings[i]['scheduledTime']} | ${_bookings[i]['systemSize']}'), trailing: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text('₹${_bookings[i]['amount']}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF5A623))), Text(_statusBadge(_bookings[i]['status'] ?? ''), style: const TextStyle(fontSize: 11))]))))),
                      // AMC Tab
                      _amcs.isEmpty ? const Center(child: Text('No AMC subscriptions')) : RefreshIndicator(onRefresh: _fetchData, child: ListView.builder(padding: const EdgeInsets.all(12), itemCount: _amcs.length, itemBuilder: (_, i) => Card(child: ListTile(title: Text('${_amcs[i]['amcId']}'), subtitle: Text('${_amcs[i]['planId']} | ${_amcs[i]['systemSize']}\n${_amcs[i]['startDate']} — ${_amcs[i]['endDate']}'), trailing: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text('₹${_amcs[i]['amount']}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF5A623))), Text(_statusBadge(_amcs[i]['status'] ?? ''), style: const TextStyle(fontSize: 11))])))),
                      // Transactions Tab
                      _transactions.isEmpty ? const Center(child: Text('No transactions')) : RefreshIndicator(onRefresh: _fetchData, child: ListView.builder(padding: const EdgeInsets.all(12), itemCount: _transactions.length, itemBuilder: (_, i) => Card(child: ListTile(title: Text('Payment: ${(_transactions[i]['paymentId'] ?? '').toString().substring(0, 16)}...'), subtitle: Text('${_transactions[i]['bookingId'] ?? _transactions[i]['amcId'] ?? ''}'), trailing: const Icon(Icons.check_circle, color: Colors.green))))),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}