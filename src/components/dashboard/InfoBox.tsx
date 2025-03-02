import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

interface InfoBoxProps {
  Icon?: any;
  spanBgColor: string;
  title: string;
  value: string;
}

const getStyles = (spanBgColor: string) => ({
  paper: { display: 'flex', flexDirection: 'row' },
  iconContainer: {
    display: 'flex',
    height: 90,
    backgroundColor: spanBgColor,
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    backgroundColor: spanBgColor,
  },
  icon: {
    height: 48,
    width: 48,
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    padding: '5px 10px',
  },
  title: { fontSize: 20, fontWeight: 500, color: grey[800] },
  descr: { display: 'block', fontWeight: 500, fontSize: 18, color: grey[800] },
});

function InfoBox({ spanBgColor, title, value, Icon }: InfoBoxProps): React.ReactElement {
  const styles = getStyles(spanBgColor);
  return (
    <Paper sx={styles.paper}>
      <Box sx={styles.iconContainer}>
        {Icon && (
          <Box sx={styles.iconWrapper}>
            <Icon sx={styles.icon} />
          </Box>
        )}
      </Box>
      <Box sx={styles.titleContainer}>
        <Typography sx={styles.title}>{title}</Typography>
        <Typography sx={styles.descr}>{value}</Typography>
      </Box>
    </Paper>
  );
}

InfoBox.defaultProps = {
  Icon: DeleteIcon,
};

export default InfoBox;
