// This service mimics backend API calls with artificial delays

export const mockBackend = {
  processPayment: async (paymentDetails: any, amount: number) => {
    return new Promise<{ success: boolean; transactionId: string }>((resolve) => {
      console.log(`Connecting to payment gateway...`);
      console.log(`Processing payment of $${amount} for card ending in ${paymentDetails.cardNumber.slice(-4)}`);
      
      setTimeout(() => {
        // Simulate a successful transaction
        const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        resolve({ success: true, transactionId });
      }, 2500); // 2.5s simulated network delay
    });
  },

  submitContactForm: async (data: any) => {
    return new Promise<{ success: boolean }>((resolve) => {
      console.log('Sending message to server:', data);
      
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  },

  subscribeNewsletter: async (email: string) => {
    return new Promise<{ success: boolean }>((resolve) => {
      console.log('Adding to mailing list:', email);
      
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};