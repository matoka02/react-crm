import { Box, keyframes, Typography, useTheme } from '@mui/material';
import React from 'react';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const getStyles = (theme: any) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingTop: '4rem',
    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 8s ease infinite`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default function ChangePasswordPage(): React.ReactElement {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <Box sx={styles.container}>
      <Typography variant="h1" sx={styles.text}>
        Change Password ...
      </Typography>
    </Box>
  );
}
