import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../api';
import Header from '../components/Header';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({});
  
  const navigate = useNavigate();

  // Fetch leads from API
  const fetchLeads = useCallback(async (page = 1, limit = 20, filterData = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        filters: JSON.stringify(filterData)
      };

      const response = await api.get('/leads', { params });
      
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Delete lead
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const response = await api.delete(`/leads/${id}`);
      if (response.data.success) {
        // Refresh the current page
        fetchLeads(pagination.page, pagination.limit, filters);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  // Action buttons renderer
  const actionsCellRenderer = (params) => {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100%' }}>
        <button
          onClick={() => navigate(`/leads/${params.data._id}/edit`)}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(params.data._id)}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  // Date formatter
  const dateFormatter = (params) => {
    if (!params.value) return '';
    return new Date(params.value).toLocaleDateString();
  };

  // Currency formatter
  const currencyFormatter = (params) => {
    if (!params.value) return '$0';
    return `$${params.value.toLocaleString()}`;
  };

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: 'Name',
      field: 'first_name',
      sortable: true,
      filter: 'agTextColumnFilter',
      valueGetter: (params) => `${params.data.first_name} ${params.data.last_name}`,
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Company',
      field: 'company',
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Phone',
      field: 'phone',
      sortable: true,
      flex: 1,
      minWidth: 130
    },
    {
      headerName: 'City',
      field: 'city',
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'State',
      field: 'state',
      sortable: true,
      filter: 'agSetColumnFilter',
      width: 80
    },
    {
      headerName: 'Source',
      field: 'source',
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: (params) => {
        const sourceMap = {
          website: 'Website',
          facebook_ads: 'Facebook Ads',
          google_ads: 'Google Ads',
          referral: 'Referral',
          events: 'Events',
          other: 'Other'
        };
        return sourceMap[params.value] || params.value;
      },
      width: 120
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: (params) => {
        const statusColors = {
          new: '#3498db',
          contacted: '#f39c12',
          qualified: '#27ae60',
          lost: '#e74c3c',
          won: '#16a085'
        };
        const color = statusColors[params.value] || '#95a5a6';
        return (
          <span style={{
            backgroundColor: color,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            textTransform: 'capitalize'
          }}>
            {params.value}
          </span>
        );
      },
      width: 100
    },
    {
      headerName: 'Score',
      field: 'score',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 80
    },
    {
      headerName: 'Lead Value',
      field: 'lead_value',
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: currencyFormatter,
      width: 120
    },
    {
      headerName: 'Qualified',
      field: 'is_qualified',
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: (params) => params.value ? '✅' : '❌',
      width: 100
    },
    {
      headerName: 'Created',
      field: 'created_at',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter,
      width: 120
    },
    {
      headerName: 'Actions',
      cellRenderer: actionsCellRenderer,
      sortable: false,
      filter: false,
      width: 120,
      pinned: 'right'
    }
  ], []);

  // Grid options
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  // Handle filter changes
  const onFilterChanged = useCallback((event) => {
    const filterModel = event.api.getFilterModel();
    const newFilters = {};

    Object.keys(filterModel).forEach(field => {
      const filter = filterModel[field];
      
      if (filter.type === 'contains') {
        newFilters[field] = { operator: 'contains', value: filter.filter };
      } else if (filter.type === 'equals') {
        newFilters[field] = { operator: 'equals', value: filter.filter };
      } else if (filter.filterType === 'set') {
        newFilters[field] = { operator: 'in', value: filter.values };
      } else if (filter.type === 'greaterThan') {
        newFilters[field] = { operator: 'gt', value: filter.filter };
      } else if (filter.type === 'lessThan') {
        newFilters[field] = { operator: 'lt', value: filter.filter };
      }
    });

    setFilters(newFilters);
    fetchLeads(1, pagination.limit, newFilters);
  }, [fetchLeads, pagination.limit]);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchLeads(newPage, pagination.limit, filters);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchLeads(1, newPageSize, filters);
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2>Lead Management</h2>
          <button
            onClick={() => navigate('/leads/new')}
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            + Add New Lead
          </button>
        </div>

        {/* Pagination Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <div>
            <span>Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <label>Rows per page: </label>
              <select
                value={pagination.limit}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                style={{
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                style={{
                  padding: '0.5rem 1rem',
                  marginRight: '0.5rem',
                  backgroundColor: pagination.page <= 1 ? '#ddd' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  marginLeft: '0.5rem',
                  backgroundColor: pagination.page >= pagination.totalPages ? '#ddd' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* AG Grid */}
        <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={leads}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onFilterChanged={onFilterChanged}
            loading={loading}
            suppressPaginationPanel={true}
            animateRows={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsList;
