import { useMemo, useState } from "react";

const ReviewsSection = ({
  reviews = [],
  movies = [],
  currentUserId,
  onEditReview,
  onDeleteReview,
  busy,
}) => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    review: "",
    rating: 5,
  });

  const movieMap = useMemo(() => {
    const map = new Map();
    movies.forEach((movie) => map.set(movie.id, movie.title));
    return map;
  }, [movies]);

  const filtered = useMemo(() => {
    if (!search.trim()) return reviews;
    return reviews.filter((review) => {
      const title = (movieMap.get(review.movie_id) || "").toLowerCase();
      const text = (review.review || "").toLowerCase();
      return (
        title.includes(search.toLowerCase()) ||
        text.includes(search.toLowerCase())
      );
    });
  }, [reviews, search, movieMap]);

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditForm({
      review: review.review || "",
      rating: review.rating,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ review: "", rating: 5 });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const success = await onEditReview(editingId, {
      review: editForm.review,
      rating: Number(editForm.rating),
    });
    if (success) {
      cancelEditing();
    }
  };

  const handleDelete = async (movieId) => {
    await onDeleteReview(movieId);
  };

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Reviews</h2>
        <input
          type="search"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No reviews available.</p>
      ) : (
        <div className="review-list">
          {filtered.map((review) => {
            const isOwner = review.user_id === currentUserId;
            const isEditing = editingId === review.id;
            const updatedLabel = review.modified_at
              ? new Date(review.modified_at).toLocaleString()
              : "Timestamp unavailable";
            return (
              <article key={review.id} className="review-card">
                <header>
                  <div>
                    <h3>
                      {movieMap.get(review.movie_id) ||
                        `Movie #${review.movie_id}`}
                    </h3>
                    <p className="muted">
                      Rating: <strong>{review.rating}/10</strong>
                    </p>
                  </div>
                  {isOwner && !isEditing && (
                    <div className="review-actions">
                      <button
                        type="button"
                        onClick={() => startEditing(review)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(review.movie_id)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </header>

                {isEditing ? (
                  <form className="form-grid" onSubmit={submitEdit}>
                    <label className="full-width">
                      <span>Review</span>
                      <textarea
                        name="review"
                        rows={3}
                        value={editForm.review}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            review: e.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label>
                      <span>Rating</span>
                      <input
                        type="number"
                        name="rating"
                        min={1}
                        max={10}
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            rating: e.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <div className="review-actions">
                      <button
                        className="secondary"
                        type="submit"
                        disabled={busy}
                      >
                        {busy ? "Saving..." : "Save"}
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>{review.review}</p>
                )}

                <footer>
                  <span className="muted">Updated: {updatedLabel}</span>
                  {isOwner && <span className="badge">Your review</span>}
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
