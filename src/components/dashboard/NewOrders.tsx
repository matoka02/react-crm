import { Box, Paper } from '@mui/material';
import { common, purple } from '@mui/material/colors';
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface ChartData {
  pv: number;
}

interface NewOrdersProps {
  data: ChartData[];
}

const styles = {
  paper: { height: 160, backgroundColor: purple[500] },
  boxTitle: {
    padding: 2,
    fontSize: 24,
    fontWeight: 500,
    color: common.white,
    backgroundColor: purple[600],
  },
  boxContent: { height: 85, padding: '5px 15px 0 15px' },
};

function NewOrders({ data }: NewOrdersProps): React.ReactElement {
  return (
    <Paper sx={styles.paper}>
      <Box component="div" sx={styles.boxTitle}>
        New Orders
      </Box>
      <Box component="div" sx={styles.boxContent}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default NewOrders;
