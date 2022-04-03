import React, { useEffect, useState, useContext } from 'react';
import { Container } from '@mui/material';
import axios from "axios";
import { Typography } from '@material-ui/core';
import CssBaseline from '@mui/material/CssBaseline';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from "notistack";
import { Store } from "../utils/Store";


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Product name',
  },
  {
    id: 'categories',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all products',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, deleteItems } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Products
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={deleteItems}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  deleteItems: PropTypes.func.isRequired,
};


export default function Home({ ...props }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({name:'', id:''});
  const [categorySelectIsOpen, setCategorySelectIsOpen] = useState(false);
  const [newDetails, setNewDetails] = useState({})
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [editId, setEditId] = useState(false);
  const { state, } = useContext(Store);
  const {user} = state;
  //const { dispatch } = useContext(Store);
  const { enqueueSnackbar, } = useSnackbar();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeCategory = (obj) => {
    setSelectedCategory({name: obj.name, id: obj.id});
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;



  //const [user, setUser] = useState(false);
  useEffect(() => {
    const localCategory = localStorage.getItem('category');
    
    (async() => {
      if (user) {
        //setUser(JSON.parse(Cookies.get('user')));
        if(!localCategory){
          const res0 = await axios.post('/api/category', 
          ['phone', 'aparel', 'electronics', 'makeup', 'swimwear', 'accessories', 'wears', 'kits']);
          // it returns the list of all the categories object fetched from db
          // categories: [{_id, name, ...}, {....}, ...]
          if(res0){
            localStorage.setItem('category', '1');
          }
        }
      }else{
        props.history.push('/login');
      }
      
      const res1 = await axios.get('/api/category');
      const res2 = await axios.get('/api/products');
      
      setCategories(res1.data)
      setRows(res2.data)
      
    })();

  }, []);

  async function showEdit (id) {
    
    try{
      const {data} = await axios.get(`/api/products/${id}`);
      if(data.name){
        setNewDetails(data);
        setEditId(id);
        setOpen(true);
        setSelectedCategory({name: data.name, id: data._id})
        setActiveCategory(data.name);
      }
    }catch(err){
      //handleClose();
    }
    
  }

  function checkClick(e, id) {

    if (e.target.nodeName.toLowerCase() != 'input') {
      showEdit(id);
    }
  }

  const loadProducts = async() => {
    try{
      const res = await axios.get('/api/products');
      setRows(res.data);
    } catch(e){
      enqueueSnackbar('Couldn\'t load new products', {variant: 'error'} );
    }
  }

  const newProductDetails = (key, value) => {
    if (!value) {
      delete newDetails[key];
    } else {
      newDetails[key] = value;
    }

    setNewDetails(() => {
      return { ...newDetails };
    })
  }

  const deleteMany = async () => {
    
    setOpenBackdrop(true)
    const {data} = await axios.delete('/api/products/deleteMany', {data: selected})
    if (data.status) {
      setOpenBackdrop(false)
      await loadProducts();
      setSelected([])
      return true;
  
    }

    return false;
  }

  const deleteOne = async () => {
    const id = selected[0];
    setOpenBackdrop(true)
    const {data} = await axios.delete(`/api/products/deleteOne/${id}`);
    
    if (data.status) {
      setOpenBackdrop(false)
      await loadProducts();
      setSelected([])
      return true;
    }

    return false;
  }

  const deleteProducts = () => {
    return selected.length > 1 ? deleteMany() : deleteOne()
  }

  const submitProduct = async () => {
    
    setOpenBackdrop(true)
    if(!editId){
      newDetails.slug = newDetails.name.toLowerCase();
    }

    try{
      const { data } = editId ? await axios.put(`/api/products/${editId}`) : 
      await axios.post('/api/products/new/add', newDetails)
      if (data.status) {
        stopBackDrop()
        handleClose();
        enqueueSnackbar(`Product was successfully ${editId ? ' updated' : ' added'}`, {variant: 'success'});
        loadProducts();
      }
      
      
    }catch(err){
      stopBackDrop();
      enqueueSnackbar('Something went wrong', {variant: 'error'});
    }
    
  }

  const stopBackDrop = () => {
    setOpenBackdrop(false);
  }

  /** This section for adding new product */

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory({name:'', id: ''});
    setActiveCategory('');
    setNewDetails({});
    setEditId(false);
  };


  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2, mt: 3 }}>
            <EnhancedTableToolbar numSelected={selected.length} deleteItems={deleteProducts} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with: rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => { handleClick(event, row._id); checkClick(event, row._id) }}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox" className={"checkbox"}>
                            <Checkbox
                              productId="123"
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.name}
                          </TableCell>

                          <TableCell align="left">{row.category_name}</TableCell>
                          <TableCell align="left">${row.price}</TableCell>
                          <TableCell align="left">{row.quantity > 0 ? 'Available' : 'Out of stock'}</TableCell>
                          <TableCell align="left">{`${row.date_added.split('-')[2].replace(/T.*/,'')}/${row.date_added.split('-')[1]}/${row.date_added.split('-')[0]}`}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box pl={3} pb={3}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => setOpen(true)}>Add product</Button>
                {
                  selected.length ? <Button variant="contained" onClick={deleteProducts}>Delete products</Button> : <Button variant="contained" disabled>Delete products</Button>
                }
              </Stack>
            </Box>
          </Paper>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Enter New product Details</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <Box
              sx={{
                width: 500,
                maxWidth: '100%',
              }}
            >
              <Box p={2}>
                <InputLabel id="demo-controlled-open-select-label">Select Category</InputLabel>
               
                <Select
                  mt={2}
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={categorySelectIsOpen}
                  onClose={() => setCategorySelectIsOpen(false)}
                  onOpen={() => setCategorySelectIsOpen(true)}
                  value={activeCategory}
                  label="Select Category"
                  
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    categories.map(item => (<MenuItem selected={activeCategory === item.name} value={item.name} id={item._id} 
                      onClick={() => {
                        handleChangeCategory({name:item.name, id:item._id}); 
                        setActiveCategory(item.name); newProductDetails('category_name', item.name); 
                        newProductDetails('category_id', item._id);
                      }}>{item.name}</MenuItem>))
                  }
                </Select> 
                
              </Box>

              <Box p={2}>
                <TextField
                  value={newDetails.name || ''}
                  onChange={(e) => newProductDetails('name', e.target.value)}
                  mt={2}
                  id="input-product-name"
                  label="Product Name"
                  placeholder="Product Name"
                  multiline
                  fullWidth
                />
              </Box>
              <Box p={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  type="number"
                  value={newDetails.price}
                  mt={2}
                  onChange={(e) => newProductDetails('price', e.target.value)}
                  id="input-product-price"
                  label="Product Price"
                  placeholder="Product Price"
                />
                <TextField
                  type="number"
                  value={newDetails.quantity}
                  mt={2}
                  onChange={(e) => newProductDetails('quantity', e.target.value)}
                  id="input-product-quantity"
                  label="Product Quantity"
                  placeholder="Product Quantity"
                />
              </Stack>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box pr={4}>
              <Button onClick={handleClose}>Cancel</Button>
              {Object.keys(newDetails).length > 3 ? <Button variant="contained" onClick={submitProduct}>Submit</Button> : <Button variant="contained" onClick={handleClose} disabled>Submit</Button>}
            </Box>
          </DialogActions>
        </Dialog>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </React.Fragment>

  );
}
