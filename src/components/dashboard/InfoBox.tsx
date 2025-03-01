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
  box: { height: 80, padding: '5px 10px', marginLeft: 90 },
  title: { fontSize: 20, fontWeight: 500, color: grey[800] },
  descr: { display: 'block', fontWeight: 500, fontSize: 18, color: grey[800] },
};

function InfoBox({ spanBgColor, title, value, Icon }: InfoBoxProps): React.ReactElement {
  return (
    <Paper>
      <Box
        sx={{
          float: 'left',
          height: 90,
          width: 90,
          textAlign: 'center',
          backgroundColor: spanBgColor,
        }}
      >
        {Icon && <Icon sx={{ height: 48, width: 48, mt: 2.5, color: "white" }} />}
      </Box>
      <Box sx={styles.box}>
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
