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
    // 1. Prepare the URL
    // We add a timestamp parameter (&_t=) to prevent browser caching.
    // This allows us to remove 'cache: no-cache' from the fetch options,
    // which prevents the browser from triggering a CORS Preflight check.
    const baseUrl = googleScriptUrl.replace(/\/exec$/, '/exec');
    const queryParams = new URLSearchParams({
      websiteId: websiteId,
      websiteTitle: websiteTitle,
      _t: Date.now().toString() // Cache buster
    });
    
    const getUrl = `${baseUrl}?${queryParams.toString()}`;
    
    // 2. Direct Fetch (Simple Request)
    // IMPORTANT: Do NOT add 'headers' object or 'cache: no-cache'.
    // Keeping this a "Simple Request" is critical for Google Apps Script.
    try {
      const response = await fetch(getUrl, {
        method: 'GET',
        mode: 'cors',
        // cache: 'no-cache', // <--- REMOVED: This causes the CORS Preflight error
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data: OrdersResponse;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // GAS sometimes returns HTML error pages instead of JSON on failure
        console.error('Raw response:', text);
        throw new Error(`Failed to parse response. Server might be down or returning HTML.`);
      }
      
      return data;

      } catch (corsError) {
        // If the direct fetch still fails, the Apps Script likely isn't deployed correctly
        // or doesn't have CORS headers set. We'll provide a helpful error message.
        console.error('Direct fetch failed:', corsError);
        
        // Check if the error is specifically about CORS
        const isCorsError = corsError instanceof TypeError && 
          (corsError.message.includes('Failed to fetch') || 
           corsError.message.includes('CORS') ||
           corsError.message.includes('Access-Control'));
        
        if (isCorsError) {
          throw new Error(
            'CORS Error: Your Google Apps Script needs to be properly deployed. ' +
            'Please:\n' +
            '1. Open your Apps Script project\n' +
            '2. Go to Deploy → New deployment\n' +
            '3. Select "Web app" as type\n' +
            '4. Set "Who has access" to "Anyone"\n' +
            '5. Deploy and use the NEW URL\n' +
            '6. Update the URL in your website settings\n\n' +
            'See docs/ORDER_TRACKING_QUICK_START.md for detailed instructions.'
          );
        }
        
        throw corsError;
      }
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    return {
      result: 'error',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export type { Order, OrderStats, OrdersResponse };