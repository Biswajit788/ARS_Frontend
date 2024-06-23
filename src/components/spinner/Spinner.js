import React from 'react';
import './Spinner.css';
import { ReactComponent as EnergyIcon } from '../../assets/energy.svg';

const Spinner = () => {
    return (
        <div className="spinner-container">
            <EnergyIcon className="spinner" />
        </div>
    );
};

export default Spinner;
