const UserModel = require('../Models/user');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const { UserName, Email, Password, Role } = req.body;

  try {
    const newUser = await UserModel({
      UserName,
      Email,
      Password,
      Role,
    });

    await newUser.save();
    const user = newUser.toObject();
    const token = jwt.sign({ UserName: user.UserName ,role : user.Role}, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Send the response with the token and user details
    res.status(201).json({ token, user });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.UserName) {
        return res.status(400).json({ error: 'Username already exists.' });
      } else if (error.keyPattern && error.keyPattern.Email) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.userSignIn = async (req, res) => {
    const { UserName, Password } = req.body;
    try {
        const user = await UserModel.findOne({ UserName });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with the given username' });
        }
        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email/Password is incorrect' });
        }
        const token =jwt.sign({UserName: user.UserName,role : user.Role},process.env.JWT_SECRET,{expiresIn: '30d'})
        // If user is found and password matches, send user details along with success message
        res.status(200).json({ success: true, message: 'Signed-In successfully',user,token});
    } catch (error) {
        console.error('Error in userSignIn:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

