export interface UserPrivilegeBenefit {
  active: boolean;
  category: string;
  desc: string | null;
  iconUrl: null | string;
  rank: null | string | number;
  value: 100000 | string | number;
}

export interface UserPrivilege {
  dividerColor: string | null;
  iconBadge: {
    url: string;
  };
  id: string | number;
  logo: {
    url: string;
  };
  name: string;
  progressBarColor: string | null;
  rank: number;
  textColor: string | null;
  benefit: {
    active: boolean;
    category: string;
    desc: null | string;
    iconUrl: null | string;
    rank: null | string;
    value: number | null | string;
  }[];
  qualification: {
    totalReservations: number;
    totalSpend: number;
  };
  regain: {
    totalReservations: number;
    totalSpend: number;
  };
  profileHeaderMobile: {
    url: string;
  };
  profileHeaderWeb: {
    url: string;
  };
}
