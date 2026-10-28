import React, { useState } from "react";
import { TextField } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating, { RatingProps } from "@mui/material/Rating";
import { InputBaseComponentProps } from "@mui/material";
import { HealthCheckRating } from "../../types";
import { getColorForRating, HEALTHBAR_TEXTS } from "../../utils";

type WrappedRatingProps = InputBaseComponentProps & RatingProps;

interface Props  {
  rating: HealthCheckRating;
  setRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
}

const FormHealthCheck = ({
  rating,
  setRating,
}: Props) => {
  const [hover, setHover] = useState<number>(-1); 

  const WrappedRating = React.forwardRef<HTMLInputElement, WrappedRatingProps>(
    (props, ref) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { className, ...rest } = props;
      return (
        <div style={{ display: 'flex', alignItems: 'center', margin: 20 }}>
          <Rating
            max={4}
            onChange={(_event, newRating) => {
              setRating(newRating ? 4-newRating : 4);
            }}
            onChangeActive={(_event, newHover) => {
              setHover(newHover);
            }}
            icon={<Favorite fontSize="inherit" sx={{ color: hover > -1 ? getColorForRating(4-hover) : getColorForRating(rating ? 4-rating : 4) }} />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ color: 'grey' }} />}
            value={Number(rating)}
            ref={ref}
            {...rest}
          />
          {rating ? <div style={{ marginLeft: '8px' }}>{HEALTHBAR_TEXTS[4-rating]}</div> : null}
        </div>
      );
    }
  );
  
  return (
      <TextField
        value={rating}
        label="Rating"
        onChange={(e) => {
          // console.log(`Selected value ${e.target.value}, type: ${typeof e.target.value}`);
          setRating(Number(e.target.value));
        }}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          inputComponent: WrappedRating
        }}
      />
  );
};

export default FormHealthCheck;
