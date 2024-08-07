import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { FaPrint } from 'react-icons/fa';
import { format } from 'date-fns';


const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                style={{ flexShrink: 0 }}
                width="240"
                height="200"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows to display</Box>
        </StyledGridOverlay>
    );
}

const AssetLogs = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assetId, setAssetId] = useState('');
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const token = window.localStorage.getItem('authToken');
            const response = await axios.get(`${apiUrl}/logs/assetlogs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { assetId: assetId },
            });



            setLogs(response.data);
        } catch (err) {
            setError('An error occurred while fetching logs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetLogs = () => {
        setLogs([]);
        setAssetId('');
    };

    const handlePrint = () => {
        window.print();
    };

    const columns = [
        {
            field: 'SlNo',
            headerName: 'S.No.',
            width: 80,
            valueGetter: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
        },
        { field: 'assetId', headerName: 'Asset Id', width: 150 },
        { field: 'asset_description', headerName: 'Asset Description', width: 200 },
        { field: 'serial', headerName: 'Serial No.', width: 200 },
        { field: 'model', headerName: 'Model No.', width: 200 },
        { field: 'oldLocation', headerName: 'Location From', width: 200 },
        { field: 'transferType', headerName: 'Transfer Type', width: 200 },
        { field: 'newLocation', headerName: 'Location To', width: 200 },
        {
            field: 'transfer_remarks',
            headerName: 'Remarks',
            width: 250,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {params.value}
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                // Define styles for different statuses
                const getStatusStyle = (status) => {
                    switch (status) {
                        case 'Accepted':
                            return { backgroundColor: 'green', color: 'white' };
                        case 'Rejected':
                            return { backgroundColor: 'red', color: 'white' };
                        default:
                            return { backgroundColor: 'transparent' };
                    }
                };

                return (
                    <div
                        style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            padding: '4px', // Adding some padding for better appearance
                            borderRadius: '4px', // Optional: Add some border-radius for rounded corners
                            ...getStatusStyle(params.value), // Apply the status style
                        }}
                    >
                        {params.value}
                    </div>
                );
            },
        },
        {
            field: 'rejection_remarks',
            headerName: 'Rejection Remarks (if any)',
            width: 250,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {params.value}
                </div>
            ),
        },
        {
            field: 'changeTimestamp',
            headerName: 'Date of Transfer',
            width: 180,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {format(new Date(params.value), 'dd-MM-yyyy hh:mm:ss')}
                </div>
            ),
        },
    ];

    return (
        <Box>
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-table, #print-table * {
                        visibility: visible;
                    }
                    #print-table {
                        margin-top: 3rem;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
                `}
            </style>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', marginTop: 3, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', flex: 2, width: '100%' }}>
                    <TextField
                        label="Asset Id"
                        variant="outlined"
                        value={assetId}
                        onChange={(e) => setAssetId(e.target.value)}
                        fullWidth={isSmallScreen}
                        sx={{ marginRight: isSmallScreen ? 0 : 2, marginBottom: isSmallScreen ? 2 : 0 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', width: '100%' }}>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={fetchLogs}
                            disabled={loading || assetId.trim() === ''}
                            sx={{ minWidth: '100px', height: '36px', marginBottom: isSmallScreen ? 1 : 0, marginRight: isSmallScreen ? 0 : 2 }}
                        >
                            {loading ? 'Loading...' : 'Fetch Logs'}
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            onClick={resetLogs}
                            sx={{ minWidth: '80px', height: '36px', marginBottom: isSmallScreen ? 1 : 0, marginRight: isSmallScreen ? 0 : 2 }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    onClick={handlePrint}
                    startIcon={<FaPrint />}
                    sx={{ marginLeft: isSmallScreen ? 0 : 2, alignSelf: isSmallScreen ? 'center' : 'flex-start' }}
                >
                    Print
                </Button>
            </Box>
            {error && <Box sx={{ color: 'red', marginBottom: 2 }}>{error}</Box>}

            <div id="print-table">
                <DataGrid
                    autoHeight
                    rows={logs}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={logs.length || 50}
                    rowsPerPageOptions={[logs.length || 50]}
                    slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                    sx={{ '--DataGrid-overlayHeight': '280px' }}
                />
            </div>
        </Box>
    );
};

export default AssetLogs;
