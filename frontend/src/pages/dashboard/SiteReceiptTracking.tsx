import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Package, 
  Calendar, 
  Filter, 
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import requisitionService from '../../services/requestService';
import siteService from '../../services/siteService';
import userService from '../../services/userService';

interface SiteReceiptData {
  site_id: number;
  site_name: string;
  site_location: string;
  receipts_by_date: Array<{
    date: string;
    receipts: Array<{
      id: number;
      request_id: number;
      request_ref: string;
      request_date: string;
      material_name: string;
      material_code: string;
      unit_name: string;
      qty_received: number;
      movement_type: string;
      has_loss: boolean;
      notes: string;
      received_by: string;
      received_by_role: string;
      received_at: string;
    }>;
    total_items: number;
    total_qty_received: number;
    has_losses: boolean;
  }>;
  total_receipts: number;
  total_qty_received: number;
  total_losses: number;
  site_engineers: string[];
}

interface SiteReceiptTrackingProps {}

const SiteReceiptTracking: React.FC<SiteReceiptTrackingProps> = () => {
  const [siteReceipts, setSiteReceipts] = useState<SiteReceiptData[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [siteEngineers, setSiteEngineers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    site_id: '',
    site_engineer_id: '',
    date_from: '',
    date_to: '',
    material_id: '',
    has_losses: ''
  });

  const [summary, setSummary] = useState({
    total_sites: 0,
    total_receipts: 0,
    total_qty_received: 0,
    total_losses: 0
  });

  useEffect(() => {
    fetchSites();
    fetchSiteEngineers();
    fetchSiteReceiptHistory();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await siteService.getAllSites();
      console.log('Sites response:', response);
      console.log('Sites data:', response.sites);
      console.log('Sites length:', response.sites?.length);
      setSites(response.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      console.error('Error details:', error);
      // Fallback: Add some test sites if API fails
      setSites([
        { id: 1, name: 'Cathedral Construction', code: 'CC-001', location: 'Kigali' },
        { id: 2, name: 'School Building', code: 'SB-002', location: 'Butare' },
        { id: 3, name: 'Hospital Project', code: 'HP-003', location: 'Gisenyi' }
      ]);
    }
  };

  const fetchSiteEngineers = async () => {
    try {
      const response = await userService.getAllUsers();
      const engineers = response.data.users.filter((user: any) => 
        user.role?.name === 'SITE_ENGINEER'
      );
      setSiteEngineers(engineers);
    } catch (error) {
      console.error('Error fetching site engineers:', error);
    }
  };

  const fetchSiteReceiptHistory = async () => {
    await fetchSiteReceiptHistoryWithFilters(filters);
  };

  const fetchSiteReceiptHistoryWithFilters = async (filterParams: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiParams: any = {};
      if (filterParams.site_id) apiParams.site_id = parseInt(filterParams.site_id);
      if (filterParams.site_engineer_id) apiParams.site_engineer_id = parseInt(filterParams.site_engineer_id);
      if (filterParams.date_from) apiParams.date_from = filterParams.date_from;
      if (filterParams.date_to) apiParams.date_to = filterParams.date_to;
      if (filterParams.material_id) apiParams.material_id = parseInt(filterParams.material_id);
      if (filterParams.has_losses) apiParams.has_losses = filterParams.has_losses === 'true';

      console.log('Fetching with params:', apiParams);
      const response = await requisitionService.getSiteReceiptHistory(apiParams);
      console.log('API Response:', response);
      
      setSiteReceipts(response.data.site_receipts || []);
      setSummary(response.data.summary || {});
    } catch (error: any) {
      console.error('Error fetching site receipt history:', error);
      setError(error.message || 'Failed to fetch site receipt history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value
    };
    setFilters(newFilters);
    
    // Fetch with new filters immediately
    fetchSiteReceiptHistoryWithFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      site_id: '',
      site_engineer_id: '',
      date_from: '',
      date_to: '',
      material_id: '',
      has_losses: ''
    };
    setFilters(clearedFilters);
    // Fetch with cleared filters immediately
    fetchSiteReceiptHistoryWithFilters(clearedFilters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building className="h-8 w-8 mr-3 text-blue-600" />
              Site Receipt Tracking
            </h1>
            <p className="text-gray-600 mt-1">
              Track material receipts by site and site engineer
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Total Sites</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{summary.total_sites}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Total Receipts</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{summary.total_receipts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Total Quantity</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{summary.total_qty_received}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Total Losses</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{summary.total_losses}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Filters
          </h2>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={filters.site_id}
              onChange={(e) => handleFilterChange('site_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Engineer</label>
            <select
              value={filters.site_engineer_id}
              onChange={(e) => handleFilterChange('site_engineer_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Engineers</option>
              {siteEngineers.map(engineer => (
                <option key={engineer.id} value={engineer.id}>{engineer.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Has Losses</label>
            <select
              value={filters.has_losses}
              onChange={(e) => handleFilterChange('has_losses', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">With Losses</option>
              <option value="false">No Losses</option>
            </select>
          </div>

        </div>
      </div>

      {/* Site Receipt Data */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading site receipt history...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      ) : siteReceipts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No site receipt history found</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {siteReceipts.map((site) => (
            <div key={site.site_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      {site.site_name}
                    </h3>
                    <p className="text-sm text-gray-600">{site.site_location}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {site.site_engineers.length} engineers
                    </span>
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {site.total_receipts} receipts
                    </span>
                    {site.total_losses > 0 && (
                      <span className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {site.total_losses} losses
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  {site.receipts_by_date.map((dateGroup) => (
                    <div key={dateGroup.date} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {formatDate(dateGroup.date)}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{dateGroup.total_items} items</span>
                            <span>{dateGroup.total_qty_received} total qty</span>
                            {dateGroup.has_losses && (
                              <span className="text-red-600 font-medium">⚠️ Has losses</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-3">
                          {dateGroup.receipts.map((receipt) => (
                            <div key={receipt.id} className={`p-3 rounded-lg border ${
                              receipt.has_loss ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{receipt.material_name}</span>
                                  <span className="text-sm text-gray-500">({receipt.material_code})</span>
                                  <span className="text-sm text-gray-600">{receipt.unit_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    receipt.has_loss ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {receipt.movement_type}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {receipt.qty_received} {receipt.unit_name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Request: {receipt.request_ref} {receipt.request_date ? `(${formatDate(receipt.request_date)})` : ''}</span>
                                <span>Received by: {receipt.received_by} ({receipt.received_by_role})</span>
                                <span>{formatDateTime(receipt.received_at)}</span>
                              </div>
                              {receipt.notes && (
                                <div className="mt-2 p-2 bg-white rounded border">
                                  <p className="text-sm text-gray-700">
                                    <strong>Notes:</strong> {receipt.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteReceiptTracking;
