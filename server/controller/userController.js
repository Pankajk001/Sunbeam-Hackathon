import bcrypt from "bcrypt";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, mobile, birth } = req.body;

  if (
    !first_name?.trim() ||
    !last_name?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !mobile?.trim() ||
    !birth?.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const sql = `INSERT INTO users (first_name, last_name, email, password, mobile, birth) VALUES (?, ?, ?, ?, ?, ?)`;

  const saltRound = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      mobile,
      birth,
    ];

    pool.query(sql, values, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error registering user",
          error: err,
        });
      } else {
        console.log(data);
        return res.status(200).json({
          success: true,
          message: "User registered successfully",
          data: data,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const sql = `SELECT * FROM users WHERE email = ?`;

    pool.query(sql, [email], async (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error Logging user",
          error: err,
        });
      } else if (data.length > 0) {
        const isPasswordMatch = await bcrypt.compare(
          password,
          data[0].password
        );
        

        if (isPasswordMatch) {
          const payload = {
            id: data[0].id,
          };

          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });

          const userData = {
            token: token,
            first_name: data[0].first_name,
            last_name: data[0].last_name,
            email: data[0].email,
          };

          return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: userData,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid Password",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err,
    });
  }
};

export const editProfile = async (req, res) => {
  const { first_name, last_name, email, password, mobile, birth } = req.body;
  const selectSql = `SELECT * FROM users WHERE email = ?`;

  pool.query(selectSql, [email], async (error, data) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }

    if (data == "") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = data[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // const {newPassword} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const id = user.id;

    // Update user by uid
    const updateSql = `
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, password = ?, mobile = ?, birth = ?
        WHERE id = ?`;

    pool.query(
      updateSql,
      [first_name, last_name, email, hashPassword, mobile, birth, id],
      (error, data) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Profile Updated successfully",
          data: data,
        });
      }
    );
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const userId = req.id; // middleware sets req.id.

  const selectSql = `SELECT * FROM users WHERE id = ?`;

  try {
    pool.query(selectSql, [userId], async (error, data) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }

      // if no user found
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = data[0];

      // Compare old password
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid old password",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = `
        UPDATE users 
        SET password = ?
        WHERE id = ?
      `;

      pool.query(updateSql, [hashedPassword, userId], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({
            success: false,
            message: "Server error while updating password",
            error: updateErr.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Password updated successfully",
        });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
