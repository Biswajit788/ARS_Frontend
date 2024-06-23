import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import UserForm from './UserForm';

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, projects, departments, roles, userFlags }) => (
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
        <DialogTitle textAlign="center">Create New User</DialogTitle>
        <DialogContent>
            <UserForm onSubmit={onSubmit} onClose={onClose} projects={projects} departments={departments} roles={roles} userFlags={userFlags} />
        </DialogContent>
    </Dialog>
);

export default CreateNewAccountModal;
