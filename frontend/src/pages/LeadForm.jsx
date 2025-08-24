import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    source: 'other',
    status: 'new',
    score: 0,
    lead_value: 0,
    last_activity_at: '',
    is_qualified: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id && id !== 'new');

  // Load lead data for editing
  useEffect(() => {
    if (isEditing) {
      setInitialLoading(true);
      fetchLead();
    }
  }, [id, isEditing]);

  const fetchLead = async () => {
    try {
      const response = await api.get(`/leads/${id}`);
      if (response.data.success) {
        const lead = response.data.data;
        setFormData({
          ...lead,
          last_activity_at: lead.last_activity_at ? 
            new Date(lead.last_activity_at).toISOString().split('T')[0] : ''
        });
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
      setError('Failed to load lead data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               (name === 'score' || name === 'lead_value') ? Number(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        last_activity_at: formData.last_activity_at || null
      };

      let response;
      if (isEditing) {
        response = await api.put(`/leads/${id}`, submitData);
      } else {
        response = await api.post('/leads', submitData);
      }

      if (response.data.success) {
        navigate('/leads');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setError(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div>
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div>Loading lead data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2>{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button
            onClick={() => navigate('/leads')}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Leads
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Basic Information */}
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Basic Information</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            {/* Company & Location */}
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Company & Location</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Source
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Lead Details */}
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Lead Details</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Score (0-100)
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Lead Value ($)
                </label>
                <input
                  type="number"
                  name="lead_value"
                  value={formData.lead_value}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Last Activity Date
                </label>
                <input
                  type="date"
                  name="last_activity_at"
                  value={formData.last_activity_at}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="is_qualified"
                    checked={formData.is_qualified}
                    onChange={handleChange}
                  />
                  <span style={{ fontWeight: 'bold' }}>Is Qualified</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/leads')}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Lead' : 'Create Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
