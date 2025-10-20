import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { useGuidesStore } from '../../../hooks/Guides/useGuides';
import styles from '../../../assets/css/index.module.css';

export default function GuidesTable({ onSelectionChange, onEdit }) {
  const { guides, loading, error, getGuides } = useGuidesStore();
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getGuides();
  }, [getGuides]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = guides.map((guide) => guide.id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

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

  if (!guides || !Array.isArray(guides)) {
    return (
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No guides data available</div>
      </Paper>
    );
  }

  const guidesWithSequence = guides.map((guide, index) => ({
    ...guide,
    id: guide.id || `guide-${index}`,
    sequence: index + 1
  }));

  const paginatedGuides = guidesWithSequence.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className={styles.usersTable}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="guides table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < guides.length}
                  checked={guides.length > 0 && selectedRows.length === guides.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGuides.map((guide) => {
              const isItemSelected = isSelected(guide.id);
              return (
                <TableRow
                  key={guide.id}
                  hover
                  onClick={(event) => handleSelectRow(event, guide.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{guide.sequence}</TableCell>
                  <TableCell>{guide.first_name}</TableCell>
                  <TableCell>{guide.last_name}</TableCell>
                  <TableCell>
                    <span style={{
                      color: guide.gender === 'male' ? '#007bff' : '#e91e63',
                      fontWeight: 'bold'
                    }}>
                      {guide.gender?.charAt(0).toUpperCase() + guide.gender?.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{guide.phone}</TableCell>
                  <TableCell>{guide.email}</TableCell>
                  <TableCell>{guide.languages}</TableCell>
                  <TableCell>{guide.experience_years} years</TableCell>
                  <TableCell>{guide.specialization}</TableCell>
                  <TableCell>
                    <span style={{
                      color: guide.rating >= 4 ? '#28a745' : guide.rating >= 3 ? '#ffc107' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {guide.rating ? guide.rating.toFixed(1) : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>{guide.location}</TableCell>
                  <TableCell>
                    <span style={{
                      color: guide.available ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {guide.available ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(guide.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) onEdit(guide);
                      }}
                      size="small"
                      sx={{ color: '#1976d2' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={guides.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
