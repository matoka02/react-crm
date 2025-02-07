import { Box, Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <Box
      sx={{
        paddingTop: '3em',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          paddingTop: '50px',
          paddingBottom: '30px',
          textAlign: 'center',
          fontSize: '36px',
        }}
      >
        <b>About</b>
      </Typography>
      <Typography
        variant="h5"
        component="h3"
        color="darkcyan"
        gutterBottom
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        React CRM Demo App 2.0.0
      </Typography>
      <Typography
        variant="body1"
        sx={{
          padding: '0px 50px',
          fontSize: '20px',
          textAlign: 'justify',
        }}
      >
        This demo app is not a real application. There is no fake API as back-end service behind the
        scene. The advanced search in the demo doesn &apos t work properly. Any data update (create
        or update record) will not be stored after hard refresh or logout. The main purpose of this
        demo is just a proof of concept.
      </Typography>
    </Box>
  );
}
