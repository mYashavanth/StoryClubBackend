const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const { authToken, refreshToken } = req.cookies;
    console.log({ authToken, refreshToken });
    jwt.verify(authToken, process.env.authToken, (err, user) => {
      if (user) {
        console.log({ authToken });
        next();
      } else {
        jwt.verify(refreshToken, process.env.refreshToken, (err, user) => {
          if (user) {
            const newAuthToken = jwt.sign(
              { userID: user.userID },
              process.env.authToken,
              { expiresIn: "1h" }
            );
            res.cookie("authToken", newAuthToken, {
              httpOnly: true,
              maxAge: 1 * 60 * 60 * 1000,
              sameSite: "none",
              // secure: true
            });
            console.log({ refreshToken });
            console.log({ newAuthToken });
            next();
          } else {
            res.status(401).send({ msg: "Unauthorized", err });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = auth;
