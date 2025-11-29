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
    // Convert POST URL to GET URL (replace /exec with /exec?action=get)
    const getUrl = googleScriptUrl.replace(/\/exec$/, '/exec') + 
      `?websiteId=${encodeURIComponent(websiteId)}&websiteTitle=${encodeURIComponent(websiteTitle)}`;
    
    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as OrdersResponse;
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    return {
      result: 'error',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export type { Order, OrderStats, OrdersResponse };

