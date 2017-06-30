const colors = {
  black: '#000000',
  blue: {
    primary: '#004A7C',
    secondary: '#799EB2'
  },
  cyan: '#10ADE4',
  gray: {
    darker: '#292B2C',
    dark: '#464A4C',
    normal: '#5F5F5F',
    light: '#636C72',
    lighter: '#ECEEEF',
    lightest: '#F7F7F9'
  },
  green: {
    primary: '#00A76F',
    secondary: '#00BABC'
  },
  orange: '#F0AD4E',
  pink: '#FF5B77',
  purple: '#613D7C',
  red: {
    primary: '#CA3A3C',
    secondary: '#F26C57'
  },
  white: '#FFFFFF',
  yellow: '#FFD500'
}

const theme = {
  fonts: {
    primary: "'Montserrat', 'Helvetica', sans-serif",
    secondary: "'GillSans', 'Helvetica', sans-serif"
  },
  images: {
    logo: 'blockchain-vector.svg'
  },
  colors: colors,
  button: {
    default: {
      color: colors.black,
      background: colors.blue.white,
      border: colors.blue.black
    },
    primary: {
      color: colors.white,
      background: colors.blue.primary,
      border: colors.blue.white
    },
    secondary: {
      color: colors.white,
      background: colors.cyan,
      border: colors.cyan
    }
  }
}

export default theme
