import React, { useState, useEffect } from 'react';
import { Website } from '../types';
import { fetchOrdersFromSheets, Order, OrderStats } from '../services/googleSheetsService';
import { ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

interface ClientOrderDashboardProps {
  website: Website;
}

export const ClientOrderDashboard: React.FC<ClientOrderDashboardProps> = ({ website }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (website.messenger.googleScriptUrl) {
      loadOrders();
    } else {
      setError('Google Spreadsheet integration not configured for this website.');
      setLoading(false);
    }
  }, [website]);

  const loadOrders = async () => {
    if (!website.messenger.googleScriptUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchOrdersFromSheets(
        website.messenger.googleScriptUrl,
        website.id || website.subdomain,
        website.title
      );

      if (result?.result === 'success' && result.orders && result.stats) {
        setOrders(result.orders);
        setStats(result.stats);
        if (result.spreadsheetUrl) {
          setSpreadsheetUrl(result.spreadsheetUrl);
        }
      } else {
        setError(result?.error || 'Failed to load orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-white text-slate-700 border-slate-300',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'Preparing': 'bg-orange-100 text-orange-800 border-orange-300',
      'Ready': 'bg-green-100 text-green-800 border-green-300',
      'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-300',
      'Delivered': 'bg-green-200 text-green-900 border-green-400',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-slate-100 text-slate-900 border-slate-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <span className="ml-3 text-slate-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <XCircle className="w-5 h-5" />
          <h3 className="font-semibold">Error Loading Orders</h3>
        </div>
        <p className="text-sm text-red-700">{error}</p>
        {!website.messenger.googleScriptUrl && (
          <p className="text-sm text-red-600 mt-2">
            Please configure Google Spreadsheet integration in the website settings.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">Total Orders</p>
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">Pending</p>
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">Delivered</p>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">Total Revenue</p>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={loading}
              className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1 disabled:opacity-50"
              title="Refresh orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Sheets
              </a>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No orders yet. Orders will appear here once customers place orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-700">Order ID</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Date/Time</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Customer</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Items</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 20).map((order, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{order.orderId}</td>
                    <td className="px-6 py-4 text-slate-600">{order.dateTime}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{order.items}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length > 20 && (
              <div className="p-4 text-center text-sm text-slate-500 border-t border-slate-200">
                Showing 20 most recent orders. <a href={spreadsheetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">View all in Google Sheets</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

