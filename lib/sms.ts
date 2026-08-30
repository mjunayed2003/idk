import { siteConfig } from "./site-config";

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  error?: string;
}

/**
 * Send raffle ticket code via SMS.
 * 
 * TODO: Integration Point for Bangladeshi SMS Gateway
 * Replace console simulation with actual API call to e.g. Alpha SMS (https://alphasms.com.bd),
 * sms.bd, BulkSMSBD, or Greenweb SMS API using environment variables:
 * - SMS_API_KEY
 * - SMS_SENDER_ID
 * 
 * Provider-agnostic signature ensures no UI changes needed.
 */
export async function sendCode(phone: string, code: string): Promise<SmsSendResult> {
  const message = `Congratulations! Your raffle ticket for ${siteConfig.shopName} is: ${code}. Keep this code safe for the upcoming grand draw!`;
  
  // Simulated asynchronous network request
  console.log(`[SMS Gateway Simulated Dispatch] To: ${phone} | Body: "${message}"`);
  
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    messageId: `SMS-BD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipient: phone,
  };
}
