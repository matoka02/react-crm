import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const getStyles = (isSmallScreen: boolean, theme: any) => ({
  pageContainer: {
    paddingTop: '3rem',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: isSmallScreen ? '0 16px' : '0 50px',
  },
  title: {
    paddingTop: '84px',
    paddingBottom: '30px',
    textAlign: 'center',
    fontSize: isSmallScreen ? '30px' : '36px',
  },
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: isSmallScreen ? '20px' : '24px',
    color: theme.palette.primary.main,
  },
  bodyText: {
    fontSize: isSmallScreen ? '16px' : '20px',
    textAlign: 'justify',
  },
});

export default function AboutPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const styles = getStyles(isSmallScreen, theme);

  return (
    <Box sx={styles.pageContainer}>
      <Typography
        variant={isSmallScreen ? 'h4' : 'h3'}
        component="h2"
        gutterBottom
        sx={styles.title}
      >
        <b>About</b>
      </Typography>
      <Typography
        variant={isSmallScreen ? 'h6' : 'h5'}
        component="h3"
        gutterBottom
        sx={styles.subtitle}
      >
        React CRM Demo App 2.0.0
      </Typography>
      <Typography variant="body1" sx={styles.bodyText}>
        This demo app is not a real application. There is no fake API as back-end service behind the
        scene. The advanced search in the demo doesn&apos;t work properly. Any data update (create
        or update record) will not be stored after hard refresh or logout. The main purpose of this
        demo is just a proof of concept.
      </Typography>
    </Box>
  );
}
