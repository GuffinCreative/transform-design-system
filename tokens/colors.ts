export const colors = {
  primary: "#F05525",
  secondary: "#F8A652",
  midOrange: "#F47C3B",
  outline: "#2A432F",
  alt: "#647967",
  midForest: "#4D6753",
  accent: "#FEE489",
  tan: "#EEC892",
  darkGreen: "#091715",
  light: "#FFFCF5",
  white: "#FEFEFE",
} as const;

export const gradients = {
  logoGradient: "linear-gradient(to right, #F8A652 0%, #F47C3B 73%, #F05525 88%)",
  greenGradient: "linear-gradient(to right, #091715 0%, #4D6753 33%, #4D6753 84%, #647968 100%)",
} as const;

export type ColorToken = typeof colors;
export type GradientToken = typeof gradients;
