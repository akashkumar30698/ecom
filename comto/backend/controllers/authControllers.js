const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function handleAdminLogin(req, res){
  const { username, password } = req.body;

  try {

    if(username != process.env.ADMIN_USERNAME || password != process.env.ADMIN_PASS){
     return res.status(401).json({ message: 'Invalid username or password' });
    }
   // const user = await User.findOne({ username });

  //  if (!user)
  //    return res.status(401).json({ message: 'Invalid username or password' });

 //   const isMatch = await bcrypt.compare(password, user.password);

//    if (!isMatch)
 //     return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: process.env.ADMIN_ID, username: process.env.ADMIN_USERNAME, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

 return   res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        message: 'Login successful',
        user: {
          id: process.env.ADMIN_ID,
          username: process.env.ADMIN_USERNAME,
          role: "ADMIN"
        }
      });

  } catch (err) {
    console.error('Login error:', err);
  return  res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    handleAdminLogin,
}
