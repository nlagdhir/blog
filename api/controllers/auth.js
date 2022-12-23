import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = (req, res) => {
  // CHECK FOR EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (error, data) => {
    if (error) return res.json(error);
    if (data.length) return res.status(409).json("User already exists");

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (email, username, password) VALUES (?)";
    const values = [req.body.email, req.body.username, hashedPassword];

    db.query(q, [values], (error, data) => {
      if (error) return res.json(error);

      return res.status(200).json("User has been created.");
    });
  });
};

const login = (req, res) => {
  // CHECK USER EXISTS

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (error, data) => {
    if (error) return res.json(error);

    if (data.length === 0) return res.status(404).json("User not found!");

    // CHECK PASSWORD
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password!");
    }

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...rest } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  });
};

const logout = (req, res) => {
  res.clearCookie("access_token").status(200).json("User has been logged out!");
};

export { register, login, logout };
