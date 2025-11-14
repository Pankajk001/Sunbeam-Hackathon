import pool from "../database/db.js";

export const getMovies = async (req, res) => {
    
    try{
        const sql = `SELECT * FROM movies`;
        pool.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Movies fetched successfully",
            data: data,
        });
    });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err,
        });
    }
    
};

export const createReview = async (req, res) => {
  const { movie_id, review, rating } = req.body;

  if (!movie_id || !review?.trim() || !rating) {
    return res.status(400).json({
      success: false,
      message: "All fields are required !"
    });
  }

  const user_id = req.id; // From auth middleware

  const sql = `
    INSERT INTO reviews (movie_id, review, rating, user_id)
    VALUES (?, ?, ?, ?)
  `;

  try {
    pool.query(sql, [movie_id, review, rating, user_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Server error while creating review",
          error: err.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        review_id: result.insertId,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      error: err.message,
    });
  }
};

export const editReview = async (req, res) => {
    try {
        const { id } = req.params; 
        const { review, rating } = req.body;

        if (!review && !rating) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        // Build dynamic query for partial update
        let updates = [];
        let values = [];

        if (review) {
            updates.push("review = ?");
            values.push(review);
        }

        if (rating) {
            updates.push("rating = ?");
            values.push(rating);
        }

        // MySQL automatically updates modified_at
        const sql = `
            UPDATE reviews 
            SET ${updates.join(", ")}
            WHERE id = ?
        `;

        values.push(id);

        
            pool.query(sql, values, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: false,
                        message: "Server error while updating review",
                        error: err.message,
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Review updated successfully",
                    review_id: id,
                })
            });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteReview = (req, res) => {
    const reviewId = req.params.id;
    const userId = req.id;  // From auth middleware

    const sql = `DELETE FROM reviews WHERE movie_id = ? AND user_id = ?`;

    try{
        pool.query(sql, [reviewId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server error while deleting review",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you are not allowed to delete it"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    });

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Server error while deleting review",
            error: err
        })
    }
};


export const getAllReviews = async (req, res) => {
    
    try{
        const sql = `SELECT * FROM reviews`;
        pool.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: err,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: data,
        });
    });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err,
        });
    }
    
};
