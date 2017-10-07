// Library Requirements
var express = require('express');
var router = express.Router();
var $ = require('jQuery');
var stripe = require("stripe")("sk_live_57EUHKMuG16ovXTYtAWc1nWe");
var firebase = require("firebase");

var name;
var email;
var photoUrl;
var uid;

var config = {
  apiKey: "AIzaSyBiaJ2BDvyQKPL_weafAv3rD7NmZSwSb7Y",
  authDomain: "vineyard-wines.firebaseapp.com",
  databaseURL: "https://vineyard-wines.firebaseio.com",
  storageBucket: "vineyard-wines.appspot.com",
};
firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/origins', function(req, res) {
  res.render('origins')
});

router.get('/checkout', function(req, res) {
  res.render('checkout', { title: 'Checkout' })
});

router.get('/userprofile', function(req, res) {
  res.render('userprofile', { title: 'Profile' })
});

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		uid = user.uid; 
	} else {

	}
});

router.post('/charge', function(req, res) {
	var stripeToken = req.body.stripeToken;
	console.log(req);
	// debugger;
	// Create Plan??
	// stripe.plans.create({
	//   amount: 1000,
	//   interval: "month",
	//   name: "Vineyard Wines Subscription",
	//   currency: "usd",
	//   id: "basicSub"
	// }, function(err, plan) {
	//   // asynchronously called
	// });

	// Create New Customer
	// stripe.customers.create({
	// 	source: stripeToken,
	// 	plan: "gold",
	// 	email: "payinguser@example.com"
	// }, function(err, customer) {
	//   // ...
	// });

	// CANCEL SUBSCRIPTION
	// stripe.subscriptions.del(
	//   "sub_3R3PlB2YlJe84a",
	//   { at_period_end: true },
	//   function(err, confirmation) {
	//     // asynchronously called
	//   }
	// );

	// CREATE INVOICE
	// stripe.invoiceItems.create({
	// 	customer: "cus_3R1W8PG2DmsmM9",
	// 	invoice: "in_3ZClIXPhhwkNsp"
	// 	amount: 1000,
	// 	currency: "usd",
	// 	description: "Charged"
	// }, function(err, invoiceItem) {
	//   // asynchronously called
	// });

	// WEBHOOK?
	// app.post("/my/webhook/url", function(request, response) {
	//   // Retrieve the request's body and parse it as JSON
	//   var event_json = JSON.parse(request.body);

	//   // Do something with event_json

	//   response.send(200);
	// });


	// Actually Charging Card
	var charge = stripe.charges.create({
		amount: 34.95, // amount in cents, again
		currency: "usd",
		plan: "base_subscription",
		card: stripeToken,
		description: email
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
			// The card has been declined
		} else {
			//Render a thank you page called "Charge"
			res.render('charge', { title: '<3' });
		}
	});

	function writeUserData(userId, name, email, imageUrl) {
		firebase.database().ref('users/' + userId).set({
			username: name,
			email: email,
			profile_picture : imageUrl
		});
	}

});

module.exports = router;
