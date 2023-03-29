import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialReactTable from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import moment from 'moment';

const ReportTable = () => {

    const [tableData, setTableData] = useState([]);

    const getTableData = async () => {
        try {
            const userData = await axios({
                method: 'post',
                url: 'http://10.3.0.57:5000/userData',
                data: {
                    token: window.localStorage.getItem("token")
                }
            });
            //console.log("🚀 ~ file: DataTable.js ~ line 49 ~ getUserData ~ response", userData.data.data)
            if (userData.data.data.role === "Admin") {
                console.log("Admin Access");
                try {
                    const response = await axios({
                        method: "get",
                        url: "http://10.3.0.57:5000/admin/items"
                    });
                    setTableData(response.data);
                } catch (e) {
                    console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
                }
            } else {
                try {
                    const response = await axios({
                        method: "post",
                        url: "http://10.3.0.57:5000/user/items",
                        data: {
                            project: userData.data.data.project,
                            dept: userData.data.data.dept
                        }
                    });
                    setTableData(response.data);
                } catch (e) {
                    console.log("🚀 ~ file: Content.jsx ~ line 21 ~ getUserData ~ e", e)
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTableData();
    }, [])

    const columns = [
        {
            accessorKey: '_id',
            header: 'System Generated ID',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'project',
            header: 'Project',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'dept',
            header: 'Department',
            size: 80,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'qty',
            header: 'Quantity',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'model',
            header: 'Model',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'serial',
            header: 'Serial Num',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'part_no',
            header: 'Part Num',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'asset_id',
            header: 'Asset ID',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'additional_info',
            header: 'Item Additional Info.',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'supplier',
            header: 'Supplier Name',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'vendoradd',
            header: 'Supplier Address',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'order_no',
            header: 'WO Number',
            size: 80,
            enableSorting: true,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'order_dt',
            header: 'WO Dated',
            size: 120,
            enableSorting: true,
            columnFilterModeOptions: ['between', 'betweenInclusive'],
        },
        {
            accessorKey: 'price',
            header: 'Contract Price',
            size: 80,
            enableEditing: false,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition1',
            header: 'Whether the Contractor is MSE or not? (Yes/No)',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition2',
            header: 'If MSE Whether belong to SC/ST?',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition4',
            header: 'Whether Item purchased outside GEM? (Yes/No)',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'condition5',
            header: 'If MSE Whether Women or Not?',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reg_no',
            header: 'Registration No.',
            size: 80,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        
        {
            accessorKey: 'pan',
            header: 'PAN Number',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'category',
            header: 'Work Category',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'cate_others',
            header: 'Work Category (if Selected Others)',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'mode',
            header: 'Mode of Procurement',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reason',
            header: 'Reason of purchase outside GEM?',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks (if any)',
            size: 300,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'created_by',
            header: 'Creator ID',
            size: 100,
            enableSorting: false,
            enableColumnFilterModes: false,
        },
        {
            accessorFn: (row) => moment(row.createdAt).format("DD-MM-YYYY hh:mm:ss"),
            id: 'createdAt',
            header: 'Created on',
            enableColumnOrdering: false,
            enableEditing: false, //disable editing on this column
            size: 200,
            enableSorting: true,
        },
        {
            accessorFn: (row) => moment(row.updatedAt).format("DD-MM-YYYY hh:mm:ss"),
            id: 'updatedAt',
            header: 'Updated on',
            enableColumnOrdering: false,
            enableEditing: false, //disable editing on this column
            size: 200,
            enableSorting: false,
        },
    ]

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
        filename: 'Gen_report',
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    const handleExportData = () => {
        csvExporter.generateCsv(tableData);
    };

    return (
        <>
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
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: '0',
                        border: '1px dotted #e0e0e0',
                    }
                }}
                enableStickyHeader
                enableColumnFilterModes
                enableRowSelection
                positionToolbarAlertBanner="bottom"
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
