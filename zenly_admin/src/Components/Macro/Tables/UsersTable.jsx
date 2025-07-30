import * as React from 'react';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useUsersStore } from '../../../hooks/Users/useUsers';
import styles from '../../../assets/css/index.module.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fullname', headerName: 'Full Name', width: 150 },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'phone', headerName: 'Phone', width: 130 },
  { field: 'address', headerName: 'Address', width: 200 },
  { 
    field: 'vip_status', 
    headerName: 'VIP Status', 
    width: 100,
    renderCell: (params) => (
      <span style={{ 
        color: params.value ? '#28a745' : '#6c757d',
        fontWeight: 'bold'
      }}>
        {params.value ? 'VIP' : 'Regular'}
      </span>
    )
  },
  { 
    field: 'type', 
    headerName: 'Type', 
    width: 100,
    renderCell: (params) => (
      <span style={{ 
        color: params.value === 'admin' ? '#dc3545' : '#007bff',
        fontWeight: 'bold'
      }}>
        {params.value || 'user'}
      </span>
    )
  },
  { 
    field: 'created_at', 
    headerName: 'Created At', 
    width: 150,
    renderCell: (params) => (
      <span>
        {new Date(params.value).toLocaleDateString()}
      </span>
    )
  },
  { 
    field: 'deleted_at', 
    headerName: 'Status', 
    width: 100,
    renderCell: (params) => (
      <span style={{ 
        color: params.value ? '#dc3545' : '#28a745',
        fontWeight: 'bold'
      }}>
        {params.value ? 'Deleted' : 'Active'}
      </span>
    )
  }
];

const paginationModel = { page: 0, pageSize: 10 };

export default function UsersTable() {
  const { users, loading, error, getUsers } = useUsersStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (loading) {
    return (
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading users...</div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </Paper>
    );
  }

  return (
    <Paper className={styles.usersTable}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
        getRowClassName={(params) => 
          params.row.deleted_at ? 'deleted-row' : ''
        }
      />
    </Paper>
  );
}
