import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (error, data) => {
    if (error) return res.status(500).json(error);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.`id`, `username`, `title`, `desc`,p.`img`,u.img as userImage, `date`, `cat` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (error, data) => {
    if (error) return res.status(500).json(error);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not Authentricted");
  }

  jwt.verify(token, "jwtkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid!");

    const q = 'INSERT INTO posts(`title`, `desc`, `img`,`cat`, `date`, `uid`) VALUES (?)'

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id
    ]

    db.query(q, [values], (error, data) => {
      if(error) return res.status(500).json(error);

      return res.json("Post has been created!")
    })
  })
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not Authentricted");
  }

  jwt.verify(token, "jwtkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?";
    console.log(userInfo);

    db.query(q, [postId, userInfo.id], (error, data) => {
      if (error) return res.status(403).json("You can not delete this post!");

      return res.status(200).json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not Authentricted");
  }

  jwt.verify(token, "jwtkey", (error, userInfo) => {
    if (error) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    const q = 'UPDATE posts SET `title` = ?,`desc` = ?,`img` = ?,`cat` = ? WHERE `id` = ? AND `uid` = ?';

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
    ]

    db.query(q, [...values, postId, userInfo.id], (error, data) => {
      if(error) return res.status(500).json(error);

      return res.json("Post has been updated!")
    })
  })
};
