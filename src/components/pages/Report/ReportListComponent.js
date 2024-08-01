import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import moment from 'moment';
import { projects, departments, work_categories } from '../data';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import DateRangeFilter from '../DateRangeFilter'; // Make sure to import the DateRangeFilter component

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function ReportListComponent() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Add state for filtered data
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined }); // Add state for date range

    //const role = window.localStorage.getItem("roleAssign");
    //const project = window.localStorage.getItem("project");
    //const dept = window.localStorage.getItem("dept");

    useEffect(() => {
        const getTableData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                if (!token) throw new Error("Authentication token not found");

                const decodedToken = parseJwt(token);
                const project = decodedToken.project;
                const dept = decodedToken.dept;
                const role = decodedToken.role;

                const endpoint = role === "Super Admin" ? "superadmin/items"
                                : role === "Admin" ? "admin/items"
                                : "user/items";

                const response = await axios.post(`${apiUrl}/${endpoint}`, null, {
                    params: {
                        project,
                        dept,
                        role,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTableData(response.data);
            } catch (error) {
                console.log(`Error fetching data`, error);
            } finally {
                setLoading(false);
            }
        }

        getTableData();
    }, [apiUrl]);

    useEffect(() => {
        const filterTableData = () => {
            if (!dateRange.from || !dateRange.to) {
                setFilteredData(tableData);
                return;
            }

            const filtered = tableData.filter((item) => {
                const itemDate = moment(item.order_dt); // Adjust this line if your date field is different
                return itemDate.isBetween(dateRange.from, dateRange.to, undefined, '[]');
            });

            setFilteredData(filtered);
        };

        filterTableData();
    }, [dateRange, tableData]); // Add dateRange and tableData as dependencies

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    // Helper function to extract unique categories and Sub-categories from tableData
    const getUniqueCategories = (data) => {
        const category = data.map(item => item.category);
        return [...new Set(category)];
    };

    const getUniqueSubCategories = (data) => {
        const subcategory = data.map(item => item.itemCategory);
        return [...new Set(subcategory)];
    };
    const uniqueCategories = useMemo(() => getUniqueCategories(tableData), [tableData]);
    const uniqueSubCategories = useMemo(() => getUniqueSubCategories(tableData), [tableData]);

    const columns = useMemo(
        () => {
            return [
                {
                    accessorKey: '_id',
                    header: 'System ID',
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    enableSorting: false,
                    size: 200,
                },
                {
                    accessorKey: 'project',
                    header: 'Project',
                    size: 100,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: projects,
                },
                {
                    accessorKey: 'dept',
                    header: 'Department',
                    size: 180,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: departments,
                },
                {
                    accessorKey: 'asset_id',
                    header: 'Product Asset Id',
                    size: 80,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'category',
                    header: 'Category',
                    size: 80,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: uniqueCategories,
                },
                {
                    accessorKey: 'itemCategory',
                    header: 'Sub-Category',
                    size: 80,
                    enableSorting: false,
                    filterVariant: 'select',
                    filterSelectOptions: uniqueSubCategories,
                },
                {
                    accessorKey: 'warranty',
                    header: 'Product Warranty (in Yrs)',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'installation_dt',
                    header: 'Product Installation Date',
                    size: 180,
                    enableSorting: true,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'licenseStartDate',
                    header: 'If Category is Software, License Start date',
                    size: 180,
                    enableSorting: true,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'licenseEndDate',
                    header: 'If Category is Software, License End date',
                    size: 180,
                    enableSorting: true,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'model',
                    header: 'Product Model No.',
                    size: 240,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'serial',
                    header: 'Product Serial No.',
                    size: 150,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'part_no',
                    header: 'Product Part No.',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'unitPrice',
                    header: 'Unit Price (INR)',
                    size: 180,
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
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Box>,
                },
                {
                    accessorKey: 'additional_info',
                    header: 'Additional Info',
                    size: 250,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'supplier',
                    header: 'Vendor Name',
                    size: 200,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'vendoradd',
                    header: 'Vendor Address',
                    size: 300,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'vendor_category',
                    header: 'Vendor Category',
                    size: 160,
                    enableSorting: false,
                },
                {
                    accessorKey: 'reg_no',
                    header: 'MSE Registration No',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'caste',
                    header: 'If MSE Whether belong to SC/ST?',
                    size: 160,
                    enableSorting: false,
                },
                {
                    accessorKey: 'gender',
                    header: 'If MSE Whether Women or Not?',
                    size: 160,
                    enableSorting: false,
                },
                {
                    accessorKey: 'gstin',
                    header: 'Vendor GSTIN',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'description',
                    header: 'PO/Contract Title',
                    size: 300,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'order_no',
                    header: 'PO Number',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'order_dt',
                    header: 'PO Date (yyyy-mm-dd)',
                    size: 180,
                    enableSorting: true,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'price',
                    header: 'Total PO Value (INR)',
                    size: 150,
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
                    accessorKey: 'mode',
                    header: 'Mode of Purchase',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'reason',
                    header: 'Reason of purchase outside GEM/GepNIC?',
                    size: 250,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'itemUser',
                    header: 'Alloted to User',
                    size: 80,
                    enableSorting: false,
                },
                {
                    accessorKey: 'itemLoc',
                    header: 'Item Location',
                    size: 160,
                    enableSorting: false,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'remarks',
                    header: 'Remarks (if any)',
                    enableSorting: false,
                    size: 250,
                    Cell: ({ cell }) => {
                        return <Box sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}>
                            {cell.getValue()}</Box>
                    }
                },
                {
                    accessorKey: 'created_by',
                    header: 'Creator ID',
                    enableSorting: false,
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    size: 80,
                },
                {
                    accessorFn: (row) => moment(row.createdAt).format("DD-MM-YYYY hh:mm:ss"),
                    id: 'createdAt',
                    header: 'Created on',
                    enableSorting: false,
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    size: 80,
                },
                {
                    accessorFn: (row) => moment(row.updatedAt).format("DD-MM-YYYY hh:mm:ss"),
                    id: 'updatedAt',
                    header: 'Last Updated on',
                    enableSorting: false,
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    size: 80,
                },
            ];
        },
        [uniqueCategories],
    );

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: 'ARS_Report',
    });

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const currentDateTime = moment().format('YYYYMMDD_HHmmss');
        const filename = `ARS_Report_${currentDateTime}`;

        const csvConfigWithDateTime = mkConfig({
            ...csvConfig, // Spread the existing config to retain other settings
            filename: filename, // Add the dynamic filename
        });

        const csv = generateCsv(csvConfigWithDateTime)(rowData);
        download(csvConfigWithDateTime)(csv);
    };

    const handleExportData = () => {
        const currentDateTime = moment().format('YYYYMMDD_HHmmss');
        const filename = `ARS_Report_${currentDateTime}`;

        const csvConfigWithDateTime = mkConfig({
            ...csvConfig, // Spread the existing config to retain other settings
            filename: filename, // Add the dynamic filename
        });

        const csv = generateCsv(csvConfigWithDateTime)(filteredData); // Ensure you export filteredData
        download(csvConfigWithDateTime)(csv);
    };

    return (
        <>
            {loading && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="rgba(0, 0, 0, 0.6)"
                    zIndex={9999}
                >
                    <div className="sweet-loading">
                        <ClipLoader color={"#36d7b7"} loading={loading} css={override} size={60} />
                    </div>
                </Box>
            )}
            <DateRangeFilter onChange={handleDateRangeChange} />
            <MaterialReactTable
                columns={columns}
                data={filteredData} // Use filtered data for the table
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
                        display: '-ms-flexbox',
                    },
                }}
                muiTableBodyCellProps={{
                    sx: {
                        color: '#000000',
                    }
                }}
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        height: '100%',
                        borderRadius: '0',
                        border: '1px dotted #e0e0e0',
                    }
                }}
                enableStickyHeader
                muiPaginationProps={{
                    color: 'primary',
                    shape: 'rounded',
                    showRowsPerPage: false,
                    variant: 'outlined',
                }}
                paginationDisplayMode="pages"
                initialState={{ columnVisibility: { _id: false }, density: 'compact', pagination: { pageSize: 100, pageIndex: 0 } }}
                enableRowNumbers={true}
                enableRowSelection
                positionToolbarAlertBanner="top"
                renderTopToolbarCustomActions={({ table }) => (
                    <Box
                        sx={{ display: 'flex', gap: '1rem', p: '0.2rem', flexWrap: 'wrap' }}
                    >
                        <Button
                            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                            onClick={handleExportData}
                            startIcon={<FileDownloadIcon />}
                        >
                            Export All Data
                        </Button>
                        <Button
                            disabled={table.getPrePaginationRowModel().rows.length === 0}
                            //export all rows, including from the next page, (still respects filtering and sorting)
                            onClick={() =>
                                handleExportRows(table.getPrePaginationRowModel().rows)
                            }
                            startIcon={<FileDownloadIcon />}
                        >
                            Export All Rows
                        </Button>
                        <Button
                            disabled={table.getRowModel().rows.length === 0}
                            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                            onClick={() => handleExportRows(table.getRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                        >
                            Export Page Rows
                        </Button>
                        <Button
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            //only export selected rows
                            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                            startIcon={<FileDownloadIcon />}
                        >
                            Export Selected Rows
                        </Button>
                    </Box>
                )}
            />
        </>
    );
}

export default ReportListComponent;
