const Offre = require("../models/offre.model");
const User = require("../models/user.model");
const Message = require("../models/messages.model");
const Proposition = require("../models/proposition.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllCompanies = async (req, res) => {
  try {
    const users = await User.find();

    const companies = users.map((user) => ({
      entrepriseName: user.entrepriseName,
      picture: user.picture,
    }));

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve companies" });
  }
};

exports.getUser = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });

  res.status(200).json({ username: user.username, email: user.email });
};

exports.getCompany = async (req, res) => {
  try {
    const token = req.headers.token;
    const user = await User.findOne({ token: token });

    res.status(200).json({
      entrepriseName: user.entrepriseName,
      postEntreprise: user.postEntreprise,
      adresseLocal: user.adresseLocal,
      numEmployees: user.numEmployees,
      secActivity: user.secActivity,
      activity: user.activity,
      website: user.website,
      entrepriseStatus: user.entrepriseStatus,
      capitalSocial: user.capitalSocial,
      bio: user.bio,
    });
  } catch {
    res.status(400).json({ msg: "Error 400" });
  }
};

exports.applyUserSettings = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });

  if (user.email != req.body.email) {
    user.email = req.body.email;
  }
  if (user.username != req.body.username) {
    user.username = req.body.username;
  }

  if (req.body.password != null) {
    user.password = bcrypt.hashSync(req.body.password, 10);
  }

  user.save();
  res.status(200);
};

exports.applyCompanySettings = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });

  if (
    user.entrepriseName != req.body.entrepriseName &&
    req.body.entrepriseName
  ) {
    user.entrepriseName = req.body.entrepriseName;
  }

  if (
    user.postEntreprise != req.body.postEntreprise &&
    req.body.postEntreprise
  ) {
    user.postEntreprise = req.body.postEntreprise;
  }

  if (user.adresseLocal != req.body.adresseLocal && req.body.adresseLocal) {
    user.adresseLocal = req.body.adresseLocal;
  }

  if (user.numEmployees != req.body.numEmployees && req.body.numEmployees) {
    user.numEmployees = req.body.numEmployees;
  }
  if (user.secActivity != req.body.secActivity && req.body.secActivity) {
    user.secActivity = req.body.secActivity;
  }
  if (user.activity != req.body.activity && req.body.activity) {
    user.activity = req.body.activity;
  }
  if (user.website != req.body.website && req.body.website) {
    user.website = req.body.website;
  }
  if (
    user.entrepriseStatus != req.body.entrepriseStatus &&
    req.body.entrepriseStatus
  ) {
    user.entrepriseStatus = req.body.entrepriseStatus;
  }
  if (user.capitalSocial != req.body.capitalSocial && req.body.capitalSocial) {
    user.capitalSocial = req.body.capitalSocial;
  }
  if (user.bio != req.body.bio && req.body.bio) {
    user.bio = req.body.bio;
  }

  user.save();
  res.status(200);
};

exports.getCompanyName = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });

  try {
    res
      .status(200)
      .json({ entrepriseName: user.entrepriseName, picture: user.picture });
  } catch {
    res.status(200).json({ entrepriseName: "", picture: "" });
  }
};

exports.applyNewPic = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });
  const data = req.body.picture;

  const split = data.split(",");
  const base64string = split[1];
  const buffer = Buffer.from(base64string, "base64");
  user.picture = data;
  user.save();
  res.status(200).json({ "worked?": "YES" });
};

exports.getCompanies = async (req, res) => {
  const users = await User.find(
    { secActivity: req.body.secActivity },
    "entrepriseName bio picture"
  );

  res.status(200).json({ users: users });
};

exports.getAdmin = async (req, res) => {
  try {
    const token = req.headers.token;
    const user = await User.findOne({ token: token });

    res.status(200).json({ Admin: user.isAdmin });
  } catch {
    res.status(400).json({ msg: "Error" });
  }
};

exports.getCompaniesAdmin = async (req, res) => {
  const keyword = req.body.entrepriseName;
  try {
    const users = await User.find(
      { entrepriseName: { $regex: keyword, $options: "i" } },
      "entrepriseName bio picture"
    );
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve suggested users." });
  }
};

exports.delUserAdmin = async (req, res) => {
  const _id = req.body._id;

  try {
    await Proposition.deleteMany({ user_id: _id });
    await Offre.deleteMany({ creator: _id });
    await User.findOneAndRemove({ _id: _id });
    res.status(200).json({ msg: "User has Been deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
exports.searchBar = async (req, res) => {
  try {
    const users = await User.find({}, "entrepriseName picture username");
    res.json(users); // Send the matched users as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCompanycard = async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await User.findOne(
      { token: token },
      "entrepriseName picture bio"
    );
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: err });
  }
};

exports.delUser = async (req, res) => {
  const token = req.headers.token;

  try {
    const id = await User.findOne({ token: token }, "_id");
    await Proposition.deleteMany({ user_id: id });
    await Offre.deleteMany({ creator: id });
    await User.findOneAndRemove({ token: token });
    res.status(200).json({ msg: "User has Been deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.getCompanyProfile = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne(
      { username: username },
      "entrepriseName picture bio website"
    );
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: err });
  }
};

exports.getUsername = async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await User.findOne({ token: token }, "username");
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: err });
  }
};
exports.getEmailCompany = async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await User.findOne({ token: token }, "email phoneNumber");
    res.status(200).json({ user });
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erreur: err });
  }
};
exports.getTokenValidation = async (req, res) => {
  const token = req.headers.token;
  const user = await User.findOne({ token: token });
  if (user != null) {
    res.status(200).json({ isValid: true, user: user });
  } else {
    res.status(200).json({ isValid: false });
  }
};

exports.getUserId = async (req, res) => {
  try {
    const token = req.headers.token;
    const user = await User.findOne({ token: token }, "_id");

    res.status(200).json({ user });
  } catch {
    res.status(400);
  }
};

exports.getCompanyNameByUserId = async (req, res) => {
  try {
    const senderId = req.params["userId"];
    const token = req.headers.token;
    const receiver = await User.findOne({ token: token });
    const company = await User.findOne({ _id: senderId });
    const message = await Message.aggregate([
      {
        $match: {
          receiver: receiver._id,
          sender: company._id,
        },
      },
      {
        $group: {
          _id: "$sender",
          sent: { $max: "$sentAt" },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $unwind: "$_id",
      },
      {
        $project: {
          "_id.entrepriseName": 1,
          "_id.picture": 1,
          sent: 1,
          unreadCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      companyName: company.entrepriseName,
      picture: company.picture,
      sentAt: message[0] ? message[0]["sent"] : "",
      unreadCount: message[0] ? message[0]["unreadCount"] : 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("error check Logs.");
  }
};
//fassakh el inscription o login elli lfou9

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Function to send email
function sendMail(email, verificationToken) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Confirmation",
    html: `	
      <div style="background-color: #f5f5f5; padding: 20px;">	
        <h1>Welcome to Our Website!</h1>	
        <p>Thank you for registering with us. Please click the button below to confirm your email address.</p>	
        <a href="http://localhost:3001/users/emailconfirmation/${verificationToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a>	
      </div>	
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

exports.inscription = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, picture } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists." });
    }
    function ValidateUsername(username) {
      const usernameRegex = /^[A-Za-z0-9_-]+$/;
      return usernameRegex.test(username);
    }
    if (!ValidateUsername(username)) {
      return res.status(400).json({ message: "Invalid username." });
    }
    function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email non valide" });
    }
    function ValidatePassword(password) {
      const regexPassword = /^.{8,}$/;
      return regexPassword.test(password);
    }
    if (!ValidatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must not be null and must have a minimum of 8 characters.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      picture,
      dateCreation: new Date(),
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.CLE,
      { expiresIn: "15d" }
    );
    savedUser.token = token;
    await savedUser.save();
    const verificationToken = jwt.sign({ email }, process.env.CLE, {
      expiresIn: "15d",
    });
    console.log("Verification Token:", verificationToken);

    sendMail(email, verificationToken);
    res.status(200).json({ message: "Success", token, user: savedUser });
  } catch (err) {
    res.status(400).json({ message: "Problem while adding the user." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.CLE,
      { expiresIn: "15d" }
    );
    user.token = token;
    await user.save();
    res.status(200).json({ message: "Success", token, user });
  } catch (err) {
    res.status(400).json({ message: "Login failed." });
  }
};

exports.emailconfirmation = async (req, res) => {
  try {
    const verificationToken = req.params.verificationToken;
    const decodedToken = jwt.verify(verificationToken, process.env.CLE);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email }); // Add 'await' here to wait for the database query to complete
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }
    user.isVerified = true;
    await user.save(); // Save the updated user object with the 'isVerified' property set to true
    return res.redirect("http://localhost:3000/");
  } catch (err) {
    res.status(400).json({ message: "Invalid verification token." });
  }
};

exports.getDaysRemaining = async (req, res) => {
  try {
    // Assuming you have a field `dateCreation` in your user schema to store the account creation date
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const accountCreationDate = user.dateCreation;
    const today = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

    // Calculate the remaining days
    if (!user.isVerified) {
      daysRemaining = Math.max(
        0,
        15 - Math.floor((today - accountCreationDate) / millisecondsPerDay)
      );
    } else {
      daysRemaining = 16;
    }

    if (daysRemaining === 0) {
      // Delete the account when daysRemaining is 0
      await User.findByIdAndDelete(userId);
      return res.json({ message: "Account deleted. Days remaining: 0" });
    }

    res.json({ daysRemaining });
  } catch (error) {
    console.error("Error fetching days remaining:", error);
    res.status(500).json({ error: "Failed to fetch days remaining." });
  }
};
