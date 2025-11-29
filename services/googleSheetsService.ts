/**
 * Service to fetch order data from Google Sheets via Apps Script
 */

interface Order {
  orderId: string;
  dateTime: string;
  customerName: string;
  location: string;
  items: string;
  itemDetails: string;
  totalAmount: string;
  note: string;
  status: string;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  ready: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

interface OrdersResponse {
  result: string;
  orders?: Order[];
  stats?: OrderStats;
  spreadsheetUrl?: string;
  error?: string;
}

export const fetchOrdersFromSheets = async (
  googleScriptUrl: string,
  websiteId: string,
  websiteTitle: string
): Promise<OrdersResponse | null> => {
  try {
    // Build GET URL with parameters
    // NO HEADERS - Google Apps Script blocks requests with custom headers (triggers preflight)
    const getUrl = googleScriptUrl.replace(/\/exec$/, '/exec') + 
      `?websiteId=${encodeURIComponent(websiteId)}&websiteTitle=${encodeURIComponent(websiteTitle)}`;
    
    // Simple GET request without headers to avoid CORS preflight
    const response = await fetch(getUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    let data: OrdersResponse;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Failed to parse response: ${text.substring(0, 100)}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    return {
      result: 'error',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export type { Order, OrderStats, OrdersResponse };

