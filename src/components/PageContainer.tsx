import { Box, Paper, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  navigation: string;
  children: ReactNode;
}

function PageContainer({ title, navigation, children }: PageContainerProps): React.ReactElement {
  const theme = useTheme();

  return (
    <Box sx={{ pt: 10, px: 3 }}>
      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.grey[600], pb: 2, display: 'block' }}
      >
        {navigation}
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
          {title}
        </Typography>
      </Paper>

      <Box sx={{ mx: 2 }}>{children}</Box>
    </Box>
  );
}

export default PageContainer;
