
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled member: ${JSON.stringify(value)}`
  );
};

enum Color {
  Green = "green",
  Yellow = "yellow",
  Orange = "orange",
  Red = "red",
  Grey = "grey"
}

export const getColorForRating = (rating: number): Color => {
  switch (true) {
    case rating < 1:
      return Color.Green;
    case rating < 2:
      return Color.Yellow;
    case rating < 3:
      return Color.Orange;
    case rating < 4:
      return Color.Red;
    default:
      return Color.Grey;
  }
};

export const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];
