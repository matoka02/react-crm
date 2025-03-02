import { Box, Paper, Typography } from '@mui/material';
import {} from '@mui/material/colors';
import React from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

interface LineBarChartProps {
  data: ChartData[];
}

const styles = {
  paper: { minHeight: 344, padding: 2 },
  title: { marginBottom: 2, display: 'block', fontSize: 24, fontWeight: 500 },
  divider: { clear: 'both' },
  containerBox: { width: '100%' },
  wrapperBox: { height: 290, textAlign: 'center' },
};

function LineBarChart({ data }: LineBarChartProps): React.ReactElement {
  return (
    <Paper sx={styles.paper}>
      <Typography variant="body1" sx={styles.title}>
        Website Analysis
      </Typography>
      <Box sx={styles.divider} />
      <Box sx={styles.containerBox}>
        <Box sx={styles.wrapperBox}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Area dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Area dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
}
export default LineBarChart;
