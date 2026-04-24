import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  cssVariables: true,
  colorSchemes: { light: true, dark: true },
});

export default theme;