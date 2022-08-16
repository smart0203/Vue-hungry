type CustomVoucher = {
  id: string;
  amount: string;
  name: string;
  quantity: number;
  tnc: string;
  desc: string;
};

type RestaurantVoucher = {
  id: string;
  name: string;
  packageDesc: string;
  desc: string;
  amount: number;
  isSelected: boolean;
  quantity: number;
  tnc: string;
};

export { CustomVoucher, RestaurantVoucher };
