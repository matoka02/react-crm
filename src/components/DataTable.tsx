import {
  Edit as ContentCreate,
  Delete as ActionDelete,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Pagination,
  Fab,
  Container,
  Tooltip,
  Box,
  useTheme,
} from '@mui/material';
import { common } from '@mui/material/colors';
import Image from 'next/image';
import React from 'react';

interface DataTableProps {
  model: string;
  items: { [key: string]: any }[];
  totalPages: number;
  page: number;
  headers: string[];
  dataKeys: string[];
  onPageChange: (_event: React.ChangeEvent<unknown>, page: number) => void;
  onDelete: (_event: React.MouseEvent<HTMLButtonElement>, id?: number) => void;
}

function DataTable({
  model,
  items,
  dataKeys,
  totalPages,
  page,
  headers,
  onPageChange,
  onDelete,
}: DataTableProps): React.ReactElement {
  const theme = useTheme();

  const getCellAlignment = (key: string) => {
    if (
      key === 'unitPrice' ||
      key === 'numInStock' ||
      key === 'productsCount' ||
      key === 'amount'
    ) {
      return 'right';
    }
    return 'left';
  };

  const renderData = (dataKey: string, data: any) => {
    if (dataKey === 'avatar') {
      const avatarUrl = data[dataKey] || `/assets/img/avatar0.png`;
      return (
        <Image
          width={35}
          height={35}
          src={avatarUrl}
          alt="avatar"
          style={{
            borderRadius: '50%',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.secondary.main,
          }}
        />
      );
    }
    if (dataKey === 'membership') {
      return data[dataKey] ? <CheckCircle /> : <Cancel />;
    }
    if (dataKey === 'action') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit" aria-label="edit">
            <Fab
              size="small"
              sx={{ marginRight: '1em', color: common.white, backgroundColor: 'green[400]' }}
              // href={model && model.includes('?path=/story/') ? `${model}` : `${model}/${data.id}`}
              href={`/${model}/form?id=${data.id}`}
            >
              <ContentCreate />
            </Fab>
          </Tooltip>
          <Tooltip title="Delete" aria-label="delete">
            <Fab
              size="small"
              sx={{ color: 'grey', fill: 'grey[500]' }}
              onClick={(evt) => onDelete(evt, data.id)}
            >
              <ActionDelete />
            </Fab>
          </Tooltip>
        </Box>
      );
    }
    if (dataKey.includes('.')) {
      const keys = dataKey.split('.');
      // return <Box>{data[keys[0]][keys[1]]}</Box>;
      const nestedData = data[keys[0]];
      return <Box>{nestedData ? (nestedData[keys[1]] ?? '-') : '-'}</Box>;
    }
    return <Box>{data[dataKey]}</Box>;
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} component="th" sx={{ width: '10%', verticalAlign: 'top' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                {dataKeys.map((dataKey) => (
                  <TableCell
                    key={dataKey}
                    sx={{
                      width: '10%',
                      verticalAlign: 'top',
                      textAlign: getCellAlignment(dataKey),
                    }}
                  >
                    {renderData(dataKey, item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} sx={{ textAlign: 'center' }}>
                No Data Found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {items.length > 0 && (
        <Container
          sx={{
            width: 350,
            margin: '0 auto',
            paddingTop: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            variant="outlined"
            color="primary"
            onChange={onPageChange}
          />
        </Container>
      )}
    </>
  );
}

export default DataTable;
