declare module 'react-star-ratings' {
  import * as React from 'react';

  interface StarRatingsProps {
    rating: number;
    starRatedColor?: string;
    starEmptyColor?: string;
    starHoverColor?: string;
    changeRating?: (newRating: number) => void;
    numberOfStars?: number;
    name?: string;
    starDimension?: string;
    starSpacing?: string;
  }

  const StarRatings: React.FC<StarRatingsProps>;

  export default StarRatings;
}
