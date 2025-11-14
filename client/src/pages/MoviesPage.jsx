import { useOutletContext } from "react-router-dom";
import MoviesSection from "../components/MoviesSection";

const MoviesPage = () => {
  const { movies, onCreateReview, reviewBusy } = useOutletContext();
  return <MoviesSection movies={movies} onCreateReview={onCreateReview} busy={reviewBusy} />;
};

export default MoviesPage;

