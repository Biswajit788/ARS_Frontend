import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import AssetListTable from './AssetListTable';
import './Dashboard.css';

function Dashboard() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState([]);

  const getTableData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const decodedToken = parseJwt(token);
      const project = decodedToken.project;
      const dept = decodedToken.dept;
      const role = decodedToken.role;

      if (role === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      const endpoint = role === "Admin" ? "admin/items" : "user/items";

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
    }
  }, [apiUrl]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getTableData();
      setLoading(false);
    };

    fetchData();
  }, [getTableData]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

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
