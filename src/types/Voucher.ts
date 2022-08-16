export interface Voucher {
  encryptedId: string;
  name: string;
  voucherCode: string;
  usageType: string;
  maxUsage: number;
  maxUsageUser: number;
  expiryDate: string;
  voucherType: string;
  paymentType: string | null;
  paymentTypes: string[];
  prefixNumber: string;
  voucherCategory: string;
  token: string;
  isUsed: boolean;
  amount: string;
  amountV2: {
    format: string;
    amount: number;
    currency: string;
  };
  minTotalPriceV2: {
    format: string;
    amount: number;
    currency: string;
  };
  restaurantCity: null;
  minTotalPrice: string;
  deductibleBalance: number;
}
