import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import VendorForm from './VendorForm';

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, vendor_categories, categories, genders }) => (
    <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        sx={{
            '& .MuiDialog-container': {
                alignItems: 'flex-start',
            },
            '& .MuiPaper-root': {
                width: '40%',
                maxWidth: '700px', // Custom width
            },
        }}
    >
        <DialogTitle textAlign="center">Create New Vendor</DialogTitle>
        <DialogContent>
            <VendorForm onSubmit={onSubmit} onClose={onClose} vendor_categories={vendor_categories} categories={categories} genders={genders} />
        </DialogContent>
    </Dialog>
);

export default CreateNewAccountModal;
