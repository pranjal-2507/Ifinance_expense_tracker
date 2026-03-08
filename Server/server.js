const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connected } = require("./config/db");
const { userModel } = require("./models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
// const {ProtectedRoute} = require("./Controllers/ProtectedRoute.js")
const { upload } = require("./multer.js")
const cloudinary = require("./cloudinary.js")

const GOOGLE_CLIENT_ID = "311238508492-i7o334gljj6h57ped9mdie180691do8e.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
const port = process.env.PUBLIC_PORT || 3000;
const { router } = require("./routes.js");
const TransactionModel = require("./models/Transaction.js");

app.use(express.json());
app.use(cors());
app.use(router);
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/friends/:user", async (req, res) => {
  try {
    let user = req.params.user;
    const friends = await userModel.findOne({ _id: user });
    res.json(friends);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post("/addfriends/:user", async (req, res) => {
  const data = req.body;
  let newObj = { ...data, expenses: [] }
  let user = req.params.user;
  try {
    await userModel.updateOne({ _id: user }, { $push: { friends: newObj } });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/addexpense/:id", async (req, res) => {
  const data = req.body;
  const userid = req.params.id;

  try {
    const user = await userModel.findOne({ _id: userid });
    if (!user) return res.status(404).send("User not found");

    const friendIndex = data.id;
    if (friendIndex < 0 || friendIndex >= user.friends.length) {
      return res.status(400).send("Invalid friend index");
    }

    const expenses = user.friends[friendIndex].expenses || [];
    const newId = expenses.length === 0 ? 1 : expenses[expenses.length - 1].expenseid + 1;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userid },
      { $push: { [`friends.${friendIndex}.expenses`]: { expenseid: newId, amount: data.amount, reason: data.reason } } },
      { new: true }
    );

    res.status(200).json(updatedUser.friends);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/getFriends/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await userModel.findOne({ _id: userid });
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.delete("/friendexpense/:id/:userid/:expenseid", async (req, res) => {
  try {
    let id = req.params.id;
    let userid = req.params.userid;
    let expid = parseInt(req.params.expenseid, 10);

    let user = await userModel.findOne({ _id: userid });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (id < 0 || id >= user.friends.length) {
      return res.status(400).send("Invalid friend index");
    }


    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userid },
      { $pull: { [`friends.${id}.expenses`]: { expenseid: expid } } },
      { new: true }
    );

    res.status(200).json(updatedUser.friends);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});


app.put("/updateexpense/:userid", async (req, res) => {
  try {
    let id = req.body.friendIndex;
    let userid = req.params.userid;
    let expid = req.body.expenseId;
    let updatedExpense = {
      expenseid: expid,
      amount: req.body.newAmount,
      reason: req.body.newReason
    };
    console.log(updatedExpense)

    let user = await userModel.findOne({ _id: userid });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (id < 0 || id >= user.friends.length) {
      return res.status(400).send("Invalid friend index");
    }

    let expensePath = `friends.${id}.expenses`;
    await userModel.updateOne(
      { _id: userid, [`${expensePath}.expenseid`]: expid },
      { $set: { [`${expensePath}.$`]: updatedExpense } }
    );

    res.status(200).send("Expense updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/userProfile/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await userModel.findById(userid);
    if (!user) return res.status(404).send("User not found");
    res.status(200).json({
      name: user.name,
      profileImg: user.profileImg || "https://via.placeholder.com/150",
      email: user.email
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/updateProfile/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const { name } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userid,
      { name },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json({ name: user.name, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/upload/:userid', upload.single('image'), async (req, res) => {
  let userid = req.params.userid;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    await userModel.findOneAndUpdate({ _id: userid }, { profileImg: result.url });
    res.status(200).send({ url: result.url });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.delete("/deletefriend/:id/:userid", async (req, res) => {
  try {
    let id = req.params.id;
    let userid = req.params.userid;

    const user = await userModel.findByIdAndUpdate(
      { _id: userid },
      { $pull: { friends: { name: id } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("Friend not found");
    }
    res.status(200).send("Friend deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/updatefriend/:friendName/:userId", async (req, res) => {
  try {
    const { friendName, userId } = req.params;
    const { name: newName } = req.body;

    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    for (let friend in user.friends) {
      if (user.friends[friend].name == friendName) {
        user.friends[friend].name = newName
        break
      }
    }

    const newuser = await userModel.findByIdAndUpdate({ _id: userId }, user)
    res.status(200).send(newName);
  } catch (err) {
    console.error("Error updating friend:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  const data = req.body;
  try {
    const emailVerify = await userModel.findOne({ email: data.email });
    if (emailVerify) {
      return res.send("User already exists");
    }
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    const newUser = new userModel({
      name: data.name,
      email: data.email,
      password: hashPassword,
      friends: [],
    });
    await newUser.save();
    res.send("Congrats! You signed up successfully");
  } catch (error) {
    res.status(500).send("Error while posting data: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.send("User not found. Please create an account.");
    }
    const hashPasswordMatch = await bcrypt.compare(password, user.password);
    if (hashPasswordMatch) {
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET
      );
      res.json({
        token: token,
        message: "You logged in successfully!",
        id: user._id,
        user: user.name,
        profileImg: user.profileImg || "https://via.placeholder.com/150"
      });
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (error) {
    res.status(500).send("Error while comparing passwords: " + error.message);
  }
});
// Google OAuth login/signup
app.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    // Find existing user by email or googleId
    let user = await userModel.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      // Create a new user for Google sign-in (no password needed)
      user = new userModel({
        name,
        email,
        googleId,
        profileImg: picture,
        friends: [],
      });
      await user.save();
    } else {
      // Update googleId and profile image if not already set
      if (!user.googleId) user.googleId = googleId;
      if (!user.profileImg && picture) user.profileImg = picture;
      await user.save();
    }

    // Issue app JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      message: "Google login successful!",
      id: user._id,
      user: user.name,
      profileImg: user.profileImg || "https://via.placeholder.com/150",
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ error: "Google authentication failed" });
  }
});

app.put("/updateTransaction/:id", async (req, res) => {
  let { id } = req.params;
  let body = req.body;
  try {
    await TransactionModel.updateOne({ _id: id }, body);
    res.send({ message: "Updated!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/deleteTransaction/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await TransactionModel.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.send({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).send({ error: "Transaction not found" });
    }
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
    console.error(err);
  }
});

app.get("/settledTransactions/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");
    res.json(user.settledTransactions || []);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/toggleSettlement/:userId", async (req, res) => {
  const { transactionId } = req.body;
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    const index = user.settledTransactions.indexOf(transactionId);
    if (index === -1) {
      user.settledTransactions.push(transactionId);
    } else {
      user.settledTransactions.splice(index, 1);
    }

    await user.save();
    res.json(user.settledTransactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  connected();
  console.log(`server running on PORT: ${port}`);
});

module.exports = app;
