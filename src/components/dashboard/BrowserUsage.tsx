import {
  Avatar,
  Box,
  Grid2,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {} from '@mui/material/colors';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface BrowserData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface BrowserUsageProps {
  data: BrowserData[];
}

const styles = {
  paper: { minHeight: 344, padding: 2 },
  title: { marginBottom: 2, display: 'block', fontSize: 24, fontWeight: 500 },
  box: { height: 290, textAlign: 'center' },
  boxList: {
    paddingTop: 2,
  },
};

function BrowserUsage({ data }: BrowserUsageProps): React.ReactElement {
  return (
    <Paper sx={styles.paper}>
      <Typography sx={styles.title}>Browser Usage</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box sx={styles.box}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie innerRadius={80} outerRadius={130} data={data} dataKey="value" fill="#8884d8">
                  {data.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box sx={styles.boxList}>
            <List>
              {data.map((item, index) => (
                <ListItem key={item.name}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: item.color }}>{item.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText id={`browser-${index}`} primary={item.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
export default BrowserUsage;
