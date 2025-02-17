import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function AboutPage() {
  const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        paddingTop: '3em',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isSmallScreen ? '0 16px' : '0 50px',
      }}
    >
      <Typography
        variant={isSmallScreen ? 'h4' : 'h3'}
        component='h2'
        gutterBottom
        sx={{
          paddingTop: '50px',
          paddingBottom: '30px',
          textAlign: 'center',
          fontSize: isSmallScreen ? '30px' : '36px'
        }}
      >
        <b>About</b>
      </Typography>
      <Typography
        variant={isSmallScreen ? 'h6' : 'h5'}
        component='h3'
        color='darkcyan'
        gutterBottom
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: isSmallScreen ? '20px' : '24px'
        }}
      >
        React CRM Demo App 2.0.0
      </Typography>
      <Typography
        variant='body1'
        sx={{
          fontSize: isSmallScreen ? '16px' : '20px',
          textAlign: 'justify',
        }}
      >
        This demo app is not a real application. There is no fake API as back-end service behind the
        scene. The advanced search in the demo doesn&apos;t work properly. Any data update (create
        or update record) will not be stored after hard refresh or logout. The main purpose of this
        demo is just a proof of concept.
      </Typography>
    </Box>
  );
}
