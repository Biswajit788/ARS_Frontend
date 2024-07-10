import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import moment from 'moment';
import { projects, departments } from '../data';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import ClipLoader   from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const ReportTable = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [tableData, setTableData] = useState([]);
    const [allTableData, setAllTableData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const refOne = useRef(null)

    const role = window.localStorage.getItem("roleAssign");
    const project = window.localStorage.getItem("project");
    const dept = window.localStorage.getItem("dept");

    const handleSelect = (date) => {
        let filtered = allTableData.filter((tableData) => {
            let tableDataDate = new Date(tableData["order_dt"]);
            return tableDataDate >= date.selection.startDate &&
                tableDataDate <= date.selection.endDate;
        })
        setStartDate(date.selection.startDate);
        setEndDate(date.selection.endDate);

        setTableData(filtered);
    }

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

    const getTableData = async () => {
        setLoading(true);
        try {
            const endpoint = role === "Admin" ? "admin/items" : "user/items";
            setIsAdmin(role === "Admin");
            const response = await axios.post(`${apiUrl}/${endpoint}`, {
              project,
              dept,
              role
            });
        
            setTableData(response.data);
            setAllTableData(response.data);
          } catch (error) {
            console.log(`Error fetching ${role} data`, error);
          } finally {
            setLoading(false);
          }
    }

    useEffect(() => {
        getTableData();
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [])

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }

    const columns = [
        {
            accessorKey: '_id',
            header: 'System Generated ID',
            size: 200,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.project}</div>,
            header: 'Project',
            size: 100,
            enableSorting: false,
            filterVariant: 'select',
            filterSelectOptions: projects,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.dept}</div>,
            header: 'Department',
            size: 100,
            enableSorting: false,
            filterVariant: 'select',
            filterSelectOptions: departments,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.description}</div>,
            header: 'Description',
            size: 300,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'category',
            header: 'Work Category',
            size: 80,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'cate_others',
            header: 'Work Category (if Selected Others)',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'model',
            header: 'Model',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'serial',
            header: 'Serial Num',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'part_no',
            header: 'Part Num',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'asset_id',
            header: 'Asset ID',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.additional_info}</div>,
            header: 'Item Additional Info.',
            size: 220,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.supplier}</div>,
            header: 'Supplier Name',
            size: 150,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.vendoradd}</div>,
            header: 'Supplier Address',
            size: 150,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.order_no}</div>,
            header: 'WO/PO Number',
            size: 200,
            enableSorting: true,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => moment(row.order_dt).format("DD-MM-YYYY"),
            id: 'order_dt',
            //accessorKey: 'order_dt',
            header: 'WO/PO Dated (dd-mm-yyyy)',
            size: 160,
            enableSorting: true,
            //columnFilterModeOptions: ['between', 'betweenInclusive'],
        },
        {
            accessorKey: 'price',
            header: 'Contract Price (INR)',
            size: 80,
            Cell: ({ cell }) =>
                <Box
                    component="span"
                    sx={(theme) => ({
                        backgroundColor:
                            cell.getValue() <= 50_000
                                ? theme.palette.success.dark
                                : cell.getValue() > 50_000 && cell.getValue() < 100_000
                                    ? theme.palette.warning.dark
                                    : theme.palette.error.dark,
                        borderRadius: '0.25rem',
                        color: '#fff',
                        maxWidth: '9ch',
                        p: '0.20rem',
                    })}
                >
                    {cell.getValue()?.toLocaleString?.('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    })}
                </Box>
        },
        {
            accessorKey: 'vendor_category',
            header: 'Vendor_category',
            size: 160,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition2',
            header: 'If MSE Whether belong to SC/ST?',
            size: 160,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition5',
            header: 'If MSE Whether Women or Not?',
            size: 160,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reg_no',
            header: 'Registration No',
            size: 80,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },

        {
            accessorKey: 'gstin',
            header: 'PAN Number',
            size: 80,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'mode',
            header: 'Mode of Procurement',
            size: 80,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.itemLoc}</div>,
            header: 'Item Physical Location',
            size: 160,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.reason}</div>,
            header: 'Reason of purchase outside GEM?',
            size: 200,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => <div className="text-wrap">{row.remarks}</div>,
            header: 'Remarks (if any)',
            size: 200,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorKey: 'created_by',
            header: 'Creator ID',
            size: 100,
            enableSorting: false,
            //enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => moment(row.createdAt).format("DD-MM-YYYY hh:mm:ss"),
            id: 'createdAt',
            header: 'Created on (dd-mm-yyyy)',
            enableColumnOrdering: false,
            enableEditing: false, //disable editing on this column
            size: 80,
            enableSorting: true,
            sortingFn: 'datetime',
        },
        {
            accessorFn: (row) => moment(row.updatedAt).format("DD-MM-YYYY hh:mm:ss"),
            id: 'updatedAt',
            header: 'Last Updated on',
            enableColumnOrdering: false,
            enableEditing: false, //disable editing on this column
            size: 200,
            enableSorting: false,
        },
    ]

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: 'Generated Procurement Report',
    });

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(tableData);
        download(csvConfig)(csv);
    };

    return (
        <>
            <div className="mb-0 row">
                <div className='col-sm-3'>
                    <label for="inputPassword" className="col-form-label text-start">Filter By Date Range:</label>
                </div>
                <div className=" col-sm-4">
                    <input
                        className='form-control text-white'
                        value={`${startDate.toLocaleDateString("es-CL")}  to  ${endDate.toLocaleDateString("es-CL")}`}
                        onClick={() => setOpen(open => !open)}
                        style={{ textAlign: 'center', backgroundColor: 'InfoText' }}
                    />
                </div>
                <div className="col-sm-2">
                    <input className='form-control' color="primary" width="150px" type="button" value="Clear Filter" onClick={()=>window.location.reload(true)}/>
                </div>
            </div>
            <div className="mb-3 row">
                <div className="col-sm-3"></div>
                <div className='col-sm-4'>
                    <span className='fw-lighter fst-italic text-primary' style={{ fontSize: 14 + 'px'  }}>Press Esc or CLick Outside to hide the Date-Range menu.</span>
                </div>
            </div>
            <div className="mb-3 row" ref={refOne}>
                {open &&
                    <div className=" col-sm-8" style={{ border: 1 + 'px dotted black' }}>
                        <DateRangePicker
                            fixedHeight={200}
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                            showDateDisplay={true}
                            direction='horizontal'
                        />
                    </div>
                }
            </div>
            <br />
            <MaterialReactTable
                columns={columns}
                data={tableData}
                muiTableProps={{
                    sx: {
                        tableLayout: 'auto',
                    },
                }}
                muiTableHeadCellProps={{
                    sx: {
                        fontSize: '14px',
                        background: '#FAF395',
                        verticalAlign: 'center',
                    },
                }}
                muiTableBodyCellProps={{
                    sx: {
                        color: '',
                    }
                }}
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: '0',
                        border: '1px dotted #e0e0e0',
                    }
                }}
                enableStickyHeader
                columnFilterDisplayMode= 'popover'
                muiPaginationProps={{
                    color: 'primary',
                    shape: 'rounded',
                    showRowsPerPage: false,
                    variant: 'outlined',
                }}
                paginationDisplayMode="pages"
                initialState={{ density: 'compact', pagination: { pageSize: 10, pageIndex: 0 } }}
                enableRowNumbers={true}
                enableRowSelection
                positionToolbarAlertBanner="top"
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.2rem', flexWrap: 'wrap' }}
                    >
                        <Button
                            color="success"
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={handleExportData}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export All Data
                        </Button>
                        <Button
                            color="warning"
                            disabled={table.getPrePaginationRowModel().rows.length === 0}
                            //export all rows, including from the next page, (still respects filtering and sorting)
                            onClick={() =>
                                handleExportRows(table.getPrePaginationRowModel().rows)
                            }
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export All Rows
                        </Button>
                        <Button
                            color="info"
                            disabled={table.getRowModel().rows.length === 0}
                            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                            onClick={() => handleExportRows(table.getRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export Page Rows
                        </Button>
                        <Button
                            color="primary"
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            //only export selected rows
                            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                            variant="contained"
                        >
                            Export Selected Rows
                        </Button>
                    </Box>
                )}
            />
        </>
    );
};

export default ReportTable;