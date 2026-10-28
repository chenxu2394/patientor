import { Rating } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import { getColorForRating, HEALTHBAR_TEXTS } from '../utils';

type BarProps = {
  rating: number;
  showText: boolean;
};

const StyledRating = styled(Rating)({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  }
});

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  const color = getColorForRating(rating);
  return (
    <div className="health-bar">
      <StyledRating
        readOnly
        value={4 - rating}
        max={4}
        icon={<Favorite fontSize="inherit" sx={{ color }} />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ color: "grey" }}/>}
      />

      {showText ? <p>{HEALTHBAR_TEXTS[rating]}</p> : null}
    </div>
  );
};

export default HealthRatingBar;
