import { useMemo, useState } from "react";

const MoviesSection = ({ movies = [], onCreateReview, busy }) => {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    movie_id: "",
    rating: 5,
    review: "",
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return movies;
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [movies, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onCreateReview({
      ...form,
      rating: Number(form.rating),
      movie_id: Number(form.movie_id),
    });
    if (success) {
      setForm({
        movie_id: "",
        rating: 5,
        review: "",
      });
    }
  };

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Movies</h2>
        <input
          type="search"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="movie-grid">
        {filtered.map((movie) => (
          <article key={movie.id} className="movie-card">
            <h3>{movie.title}</h3>
            <p>
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString()
                : "Release date unavailable"}
            </p>
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="muted">No movies match your search right now.</p>
        )}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <h3>Create Review</h3>
        <label>
          <span>Select movie</span>
          <select
            name="movie_id"
            value={form.movie_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose a movie --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Rating (1-10)</span>
          <input
            type="number"
            name="rating"
            value={form.rating}
            min={1}
            max={10}
            onChange={handleChange}
            required
          />
        </label>
        <label className="full-width">
          <span>Review</span>
          <textarea
            name="review"
            rows={3}
            value={form.review}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            required
          />
        </label>
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Submitting..." : "Add Review"}
        </button>
      </form>
    </section>
  );
};

export default MoviesSection;
