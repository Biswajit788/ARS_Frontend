import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import AssetListTable from './AssetListTable';
import './Dashboard.css';

function Dashboard() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);

  const role = window.localStorage.getItem("roleAssign");
  const project = window.localStorage.getItem("project");
  const dept = window.localStorage.getItem("dept");

  const getTableData = useCallback(async () => {
    try {
      const endpoint = role === "Admin" ? "admin/items" : "user/items";
      setIsAdmin(role === "Admin");
      const response = await axios.post(`${apiUrl}/${endpoint}`, {
        project,
        dept,
        role
      });
      setTableData(response.data);
    } catch (error) {
      console.log(`Error fetching ${role} data`, error);
    }
  }, [apiUrl, role, project, dept]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getTableData();
      setLoading(false);
    };

    fetchData();
  }, [getTableData]);

  return (
    <div className='main-container'>
      <div className="table-title">
        <span>Asset Database</span>
      </div>
      <div className="table-content">
        <AssetListTable
          tableData={tableData}
          setTableData={setTableData}
          apiUrl={apiUrl}
          loading={loading}
          isAdmin={isAdmin}
          getTableData={getTableData}
        />
      </div>
    </div>
  );
}

export default Dashboard;
