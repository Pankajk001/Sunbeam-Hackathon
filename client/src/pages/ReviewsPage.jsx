import { useOutletContext } from "react-router-dom";
import ReviewsSection from "../components/ReviewsSection";

const ReviewsPage = () => {
  const {
    reviews,
    movies,
    userId,
    onEditReview,
    onDeleteReview,
    reviewBusy,
  } = useOutletContext();

  return (
    <ReviewsSection
      reviews={reviews}
      movies={movies}
      currentUserId={userId}
      onEditReview={onEditReview}
      onDeleteReview={onDeleteReview}
      busy={reviewBusy}
    />
  );
};

export default ReviewsPage;

