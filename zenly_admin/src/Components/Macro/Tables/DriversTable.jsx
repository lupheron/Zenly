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
import { useDriversStore } from '../../../hooks/Drivers/useDrivers';
import styles from '../../../assets/css/index.module.css';

export default function DriversTable({ onSelectionChange, onEdit }) {
  const { drivers, loading, error, getDrivers } = useDriversStore();
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getDrivers();
  }, [getDrivers]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = drivers.map((driver) => driver.id);
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
        <div>Loading drivers...</div>
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

  if (!drivers || !Array.isArray(drivers)) {
    return (
      <Paper sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No drivers data available</div>
      </Paper>
    );
  }

  const driversWithSequence = drivers.map((driver, index) => ({
    ...driver,
    id: driver.id || `driver-${index}`,
    sequence: index + 1
  }));

  const paginatedDrivers = driversWithSequence.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className={styles.usersTable}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="drivers table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < drivers.length}
                  checked={drivers.length > 0 && selectedRows.length === drivers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>#</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Vehicle Model</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price/Day</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrivers.map((driver) => {
              const isItemSelected = isSelected(driver.id);
              return (
                <TableRow
                  key={driver.id}
                  hover
                  onClick={(event) => handleSelectRow(event, driver.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{driver.sequence}</TableCell>
                  <TableCell>{driver.first_name}</TableCell>
                  <TableCell>{driver.last_name}</TableCell>
                  <TableCell>
                    <span style={{
                      color: driver.gender === 'male' ? '#007bff' : '#e91e63',
                      fontWeight: 'bold'
                    }}>
                      {driver.gender?.charAt(0).toUpperCase() + driver.gender?.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.language}</TableCell>
                  <TableCell>{driver.experience_years} years</TableCell>
                  <TableCell>{driver.license_number}</TableCell>
                  <TableCell>{driver.vehicle_type}</TableCell>
                  <TableCell>{driver.vehicle_model}</TableCell>
                  <TableCell>{driver.plate_number}</TableCell>
                  <TableCell>
                    <span style={{
                      color: driver.rating >= 4 ? '#28a745' : driver.rating >= 3 ? '#ffc107' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {driver.rating ? driver.rating.toFixed(1) : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>{driver.location}</TableCell>
                  <TableCell>
                    <span style={{
                      color: '#28a745',
                      fontWeight: 'bold'
                    }}>
                      ${driver.price_per_day}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{
                      color: driver.available ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {driver.available ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(driver.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) onEdit(driver);
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
        count={drivers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
