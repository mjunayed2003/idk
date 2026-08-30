export interface SiteConfig {
  shopName: string;
  tagline: string;
  currencySymbol: string;
  defaultPrizes: {
    first: string;
    second: string;
    third: string;
  };
}

export const siteConfig: SiteConfig = {
  shopName: "IDK",
  tagline: "Exclusive Customer Reward Raffle & Grand Prize Draws",
  currencySymbol: "৳",
  defaultPrizes: {
    first: "Smart 4K UHD LED TV (55\")",
    second: "Microwave Oven & Air Fryer Combo",
    third: "Wireless ANC Soundbar & Subwoofer",
  },
};
