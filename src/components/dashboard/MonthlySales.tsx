import { Box, Paper } from '@mui/material';
import { common, pink } from '@mui/material/colors';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';

interface ChartData {
  name: string;
  uv: number;
}

interface MonthlySalesProps {
  data: ChartData[];
}

const styles = {
  paper: { height: 150, backgroundColor: pink[600] },
  boxTitle: {
    padding: 2,
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 2,
    color: common.white,
    backgroundColor: pink[500],
  },
  boxContent: { marginLeft: 'auto', marginRight: 'auto', width: '95%', height: 85 },
};

function MonthlySales({ data }: MonthlySalesProps): React.ReactElement {
  return (
    <Paper sx={styles.paper}>
      <Box sx={styles.boxTitle}>Monthly Sales</Box>
      <Box sx={styles.boxContent}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="uv" fill={pink[500]} />
            <XAxis dataKey="name" stroke="none" tick={{ fill: common.white }} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default MonthlySales;
