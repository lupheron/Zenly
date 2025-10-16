import * as React from 'react';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useGuidesStore } from '../../../hooks/Guides/useGuides';
import styles from '../../../assets/css/index.module.css';

const columns = [
  {
    field: 'sequence',
    headerName: '#',
    width: 70,
    sortable: false,
    filterable: false
  },
  { 
    field: 'first_name', 
    headerName: 'First Name', 
    width: 130 
  },
  { 
    field: 'last_name', 
    headerName: 'Last Name', 
    width: 130 
  },
  { 
    field: 'gender', 
    headerName: 'Gender', 
    width: 100,
    renderCell: (params) => (
      <span style={{
        color: params.value === 'male' ? '#007bff' : '#e91e63',
        fontWeight: 'bold'
      }}>
        {params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
      </span>
    )
  },
  { 
    field: 'phone', 
    headerName: 'Phone', 
    width: 130 
  },
  { 
    field: 'email', 
    headerName: 'Email', 
    width: 200 
  },
  { 
    field: 'languages', 
    headerName: 'Languages', 
    width: 150 
  },
  { 
    field: 'experience_years', 
    headerName: 'Experience', 
    width: 120,
    renderCell: (params) => (
      <span>{params.value} years</span>
    )
  },
  { 
    field: 'specialization', 
    headerName: 'Specialization', 
    width: 150 
  },
  { 
    field: 'rating', 
    headerName: 'Rating', 
    width: 100,
    renderCell: (params) => (
      <span style={{
        color: params.value >= 4 ? '#28a745' : params.value >= 3 ? '#ffc107' : '#dc3545',
        fontWeight: 'bold'
      }}>
        {params.value ? params.value.toFixed(1) : 'N/A'}
      </span>
    )
  },
  { 
    field: 'location', 
    headerName: 'Location', 
    width: 150 
  },
  {
    field: 'available',
    headerName: 'Available',
    width: 100,
    renderCell: (params) => (
      <span style={{
        color: params.value ? '#28a745' : '#dc3545',
        fontWeight: 'bold'
      }}>
        {params.value ? 'Yes' : 'No'}
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
  }
];

const paginationModel = { page: 0, pageSize: 10 };

export default function GuidesTable() {
  const { guides, loading, error, getGuides } = useGuidesStore();

  useEffect(() => {
    getGuides();
  }, [getGuides]);

  if (loading) {
    return (
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading guides...</div>
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

  // Add sequence numbers to the guides data
  const guidesWithSequence = guides.map((guide, index) => ({
    ...guide,
    sequence: index + 1
  }));

  return (
    <Paper className={styles.usersTable}>
      <DataGrid
        rows={guidesWithSequence}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
