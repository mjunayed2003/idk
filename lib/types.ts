export type CustomerStatus = "active" | "won" | "expired";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  code: string;
  status: CustomerStatus;
  createdAt: string; // ISO date
}

export interface DrawWinner {
  position: 1 | 2 | 3;
  customerId: string;
  name: string;
  code: string;
  prize: string;
}

export interface Draw {
  id: string;
  date: string; // ISO date
  title: string;
  winners: DrawWinner[];
}

export interface PrizeConfig {
  first: { title: string; highlight: string; warranty?: string };
  second: { title: string; highlight: string; warranty?: string };
  third: { title: string; highlight: string; warranty?: string };
}
