import { Box, Button, Grid2, Typography, useTheme, Theme, SxProps } from '@mui/material';
import { common } from '@mui/material/colors';
import Link from 'next/link';

import CSS from '../styles/404.module.css';

const bgdImage = '/assets/img/header-footer-gradient-bg.png';

const getStyles = (theme: Theme) => ({
  container: {
    position: 'relative',
    minHeight: '100vh',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: '#181828',
    fontSize: '16px',
    lineHeight: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexGrow: 1,
  },
  topHeader: {
    '&::before': {
      position: 'absolute',
      top: 0,
      left: 0,
      content: '""',
      display: 'block',
      width: '100%',
      height: '4px',
      backgroundImage: `url(${bgdImage})`,
      backgroundRepeat: ' repeat-x',
      backgroundSize: 'contain',
      // opacity: 0.5,
    },
  },
  error: {
    position: 'relative',
    boxSizing: 'border-box',
    flexGrow: 1,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    marginTop: '70px',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
      paddingBottom: '100px',
      height: '100vh',
    },
  },
  errorContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('md')]: {
      top: '55%',
    },
    [theme.breakpoints.down('sm')]: {
      position: 'static',
      margin: '0 auto',
      transform: 'none',
      paddingTop: '300px',
    },
  } as SxProps<Theme>,
  errorMessage: {
    textAlign: 'center',
    color: '#181828',
  },
  messageTitle: {
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    fontSize: '5.6rem',
    paddingBottom: '40px',
    maxWidth: '960px',
    margin: '0 auto',
    [theme.breakpoints.down('xl')]: {
      fontSize: '3.5rem',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '34px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '36px',
      paddingBottom: '20px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '30px',
    },
  },
  messageText: {
    lineHeight: '42px',
    fontSize: '18px',
    padding: '0 60px',
    maxWidth: '680px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: 2,
      paddingRight: '20px',
      paddingLeft: '20px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '15px',
      paddingRight: '10px',
      paddingLeft: '10px',
    },
  },
  errorNav: {
    maxWidth: '600px',
    margin: '40px auto 0',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px',
    },
  },
  eNavLink: {
    position: 'relative',
    overflow: 'hidden',
    height: '45px',
    lineHeight: '45px',
    width: '170px',
    display: 'inline-block',
    paddingTop: 0,
    margin: '0 15px',
    border: '1px solid #181828',
    verticalAlign: 'top',
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontSize: '11px',
    letterSpacing: '0.1rem',
    color: '#181828',
    '&:before': {
      content: '""',
      height: '200px',
      background: '#212121',
      position: 'absolute',
      top: '70px',
      right: '70px',
      width: '260px',
      transition: 'all 0.3s',
      transform: 'rotate(50deg)',
    },
    '&:after': {
      transition: 'all 0.3s',
      zIndex: 999,
      position: 'relative',
      content: '"Home Page"',
    },
    '&:hover:before': {
      top: '-60px',
      right: '-50px',
    },
    '&:hover': {
      color: common.white,
    },
    '&:nth-child(2):hover:after': {
      color: common.white,
    },
  },
  menuIcon: { color: theme.palette.primary.main },
});

export default function NotFoundPage() {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    // <div>
    //   <h1>404 - Page Not Found</h1>
    // </div>

    <Grid2 container sx={styles.container}>
      <Box sx={styles.topHeader} />

      {/* Dust particel */}
      <Box>
        <Box component="div" className={CSS.starSecondary} />
        <Box component="div" className={CSS.starThird} />
        <Box component="div" className={CSS.starFourth} />
        <Box component="div" className={CSS.starFifth} />
      </Box>

      {/* Lamp */}
      <Box className={CSS.lampWrap}>
        <Box component="div" className={CSS.lamp}>
          <Box component="div" className={CSS.cable} />
          <Box component="div" className={CSS.cover} />
          <Box component="div" className={CSS.inCover}>
            <Box component="div" className={CSS.bulb} />
          </Box>
          <Box component="div" className={CSS.light} />
        </Box>
      </Box>

      {/* Content */}
      <Box component="section" sx={styles.error}>
        <Box sx={styles.errorContent}>
          <Box sx={styles.errorMessage}>
            <Typography variant="h1" sx={styles.messageTitle}>
              Page Not Found
            </Typography>
            <Typography variant="body1" sx={styles.messageText}>
              We&apos;re sorry, the page you were looking for isn&apos;t found here. The link you
              followed may either be broken or no longer exists. Please try again, or take a look at
              our.
            </Typography>
          </Box>
          <Box sx={styles.errorNav}>
            <Link href="/" passHref>
              <Button component="a" sx={styles.eNavLink} />
            </Link>
          </Box>
        </Box>
      </Box>
    </Grid2>
  );
}
