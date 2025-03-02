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

const styles = {
  paper: { display: 'flex', flexDirection: 'row' },
  boxTitle: {
    flex: 1,
    padding: '5px 10px',
  },
  title: { fontSize: 20, fontWeight: 500, color: grey[800] },
  descr: { display: 'block', fontWeight: 500, fontSize: 18, color: grey[800] },
};

function InfoBox({ spanBgColor, title, value, Icon }: InfoBoxProps): React.ReactElement {
  return (
    <Paper sx={styles.paper}>
      <Box
        sx={{
          display: 'flex',
          height: 90,
          backgroundColor: spanBgColor,
        }}
      >
        {Icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 90,
              height: 90,
              backgroundColor: spanBgColor,
            }}
          >
            <Icon
              sx={{
                height: 48,
                width: 48,
                color: 'white',
              }}
            />
          </Box>
        )}
      </Box>
      <Box sx={styles.boxTitle}>
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
