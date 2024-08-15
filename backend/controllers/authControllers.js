const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const SALT_ROUNDS = +process.env.SALT_ROUNDS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const subscriptionPrices = {
  1: 30,
  2: 50,
  3: 70,
  6: 125,
  12: 240,
};


const productIds = {
  1: "prod_QfBVqgGSbQCnxe", // Product ID for 1 month
  2: "prod_QfL15BFJNt9m1w", // Product ID for 2 months
  3: "prod_QfL2Ae8vMH8G88", // Product ID for 3 months
  6: "prod_QfL2MdLFudFGGR", // Product ID for 6 months
  12: "prod_QfL2o0C2oaQLMB" // Product ID for 12 months
};

const register = async (req, res) => {
  const { username, email, password, phoneNumber, role, subscriptionDuration, paymentMethodId } = req.body;

  if (!subscriptionPrices[subscriptionDuration]) {
    return res.status(400).json({ msg: "Invalid subscription duration" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
    });

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set the payment method as the default for this customer
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create Stripe subscription with recurring billing
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: 'eur',
          product: productIds[subscriptionDuration], // Use the correct Product ID
          unit_amount: subscriptionPrices[subscriptionDuration] * 100, // amount in cents
          recurring: {
            interval: 'month', // Set the billing interval to month
            interval_count: subscriptionDuration // The duration (e.g., 1 month, 2 months, etc.)
          }
        }
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    user = new User({
      username,
      email,
      password,
      phoneNumber,
      role,
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionEndDate: new Date(subscription.current_period_end * 1000)
    });

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role, name: user.username } };
    const token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createUser = async (req, res) => {
  const { username, email, password, phoneNumber, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    user = new User({ username, email, password, phoneNumber, role });
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const payload = {
      user: { id: user.id, role: user.role, name: user.username },
    };
    const token = jwt.sign(
      payload,
      PRIVATE_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports = { createUser,register, login };
