import { Customer, Draw, DrawWinner } from "./types";
import { siteConfig } from "./site-config";
import { sendCode } from "./sms";

/**
 * In-memory & Client-persistent Mock Database
 * 
 * TODO: Integration Point for Database (PostgreSQL / Prisma / Drizzle / Supabase / MongoDB)
 * Replace the in-memory / local storage persistence below with real database queries.
 * The exported functions match standard async repository patterns so UI components won't change.
 */

// Initial Seed Data
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Tanvir Ahmed",
    phone: "+880 1711-234567",
    address: "House 42, Road 11, Banani, Dhaka",
    product: "Sony Bravia 55\" 4K TV",
    code: "RAFFLE-8842-TX",
    status: "active",
    createdAt: "2026-08-20T10:15:00.000Z",
  },
  {
    id: "cust-002",
    name: "Nusrat Jahan",
    phone: "+880 1819-876543",
    address: "Flat 4B, Green Road, Dhanmondi, Dhaka",
    product: "Samsung Refrigerator 320L",
    code: "RAFFLE-1923-NJ",
    status: "active",
    createdAt: "2026-08-21T14:30:00.000Z",
  },
  {
    id: "cust-003",
    name: "Mahmudul Hasan",
    phone: "+880 1912-345678",
    address: "Block C, Bashundhara R/A, Dhaka",
    product: "LG Inverter AC 1.5 Ton",
    code: "RAFFLE-4419-MH",
    status: "active",
    createdAt: "2026-08-22T11:00:00.000Z",
  },
  {
    id: "cust-004",
    name: "Farzana Yasmin",
    phone: "+880 1675-998877",
    address: "Sector 7, Uttara, Dhaka",
    product: "Philips Digital Air Fryer XXL",
    code: "RAFFLE-7756-FY",
    status: "active",
    createdAt: "2026-08-24T16:45:00.000Z",
  },
  {
    id: "cust-005",
    name: "Kazi Rafiqul Islam",
    phone: "+880 1552-112233",
    address: "CDA Avenue, GEC Circle, Chattogram",
    product: "Apple iPad Air M2",
    code: "RAFFLE-3312-KR",
    status: "active",
    createdAt: "2026-08-25T09:20:00.000Z",
  },
  {
    id: "cust-006",
    name: "Sadia Chowdhury",
    phone: "+880 1733-445566",
    address: "Mirpur 10, Dhaka",
    product: "Bose SoundLink Max Speaker",
    code: "RAFFLE-6644-SC",
    status: "active",
    createdAt: "2026-08-26T18:10:00.000Z",
  },
  {
    id: "cust-007",
    name: "Abdur Rahman",
    phone: "+880 1844-667788",
    address: "Zindabazar, Sylhet",
    product: "Delonghi Espresso Machine",
    code: "RAFFLE-2299-AR",
    status: "active",
    createdAt: "2026-08-27T13:40:00.000Z",
  },
  {
    id: "cust-008",
    name: "Sultana Razia",
    phone: "+880 1988-123456",
    address: "Chawkbazar, Cumilla",
    product: "Dyson V12 Vacuum Cleaner",
    code: "RAFFLE-9911-SR",
    status: "won",
    createdAt: "2026-07-28T12:00:00.000Z",
  },
  {
    id: "cust-009",
    name: "Anisur Rahman",
    phone: "+880 1722-987654",
    address: "Shaheb Bazar, Rajshahi",
    product: "Panasonic Microwave Oven",
    code: "RAFFLE-5522-AR",
    status: "won",
    createdAt: "2026-07-29T15:00:00.000Z",
  },
];

const INITIAL_DRAWS: Draw[] = [
  {
    id: "draw-001",
    date: "2026-08-15T20:00:00.000Z",
    title: "Independence Monsoon Gala Draw",
    winners: [
      {
        position: 1,
        customerId: "cust-008",
        name: "Sultana Razia",
        code: "RAFFLE-9911-SR",
        prize: "55\" 4K Smart Android TV",
      },
      {
        position: 2,
        customerId: "cust-009",
        name: "Anisur Rahman",
        code: "RAFFLE-5522-AR",
        prize: "Convection Microwave & Air Fryer",
      },
      {
        position: 3,
        customerId: "cust-prev-1",
        name: "Imtiaz Hossain",
        code: "RAFFLE-3104-IH",
        prize: "Premium Soundbar with Subwoofer",
      },
    ],
  },
  {
    id: "draw-002",
    date: "2026-07-15T20:00:00.000Z",
    title: "Eid Summer Special Raffle",
    winners: [
      {
        position: 1,
        customerId: "cust-prev-2",
        name: "Rashed Karim",
        code: "RAFFLE-1088-RK",
        prize: "Double Door Frost-Free Refrigerator",
      },
      {
        position: 2,
        customerId: "cust-prev-3",
        name: "Mst. Salma Khatun",
        code: "RAFFLE-7731-SK",
        prize: "Automatic Front-Load Washing Machine",
      },
      {
        position: 3,
        customerId: "cust-prev-4",
        name: "Zakir Hossain",
        code: "RAFFLE-4490-ZH",
        prize: "Smart Robotic Vacuum Cleaner",
      },
    ],
  },
];

export interface PrizeConfig {
  first: {
    title: string;
    highlight: string;
    warranty: string;
  };
  second: {
    title: string;
    highlight: string;
    warranty: string;
  };
  third: {
    title: string;
    highlight: string;
    warranty: string;
  };
}

const DEFAULT_PRIZES: PrizeConfig = {
  first: {
    title: "Smart 4K UHD LED TV (55\")",
    highlight: "Grand Champion Prize",
    warranty: "Official Brand Warranty Included",
  },
  second: {
    title: "Microwave Oven & Air Fryer Combo",
    highlight: "1st Runner-Up Mega Prize",
    warranty: "Official Brand Warranty Included",
  },
  third: {
    title: "Wireless ANC Soundbar & Subwoofer",
    highlight: "2nd Runner-Up Premium Audio",
    warranty: "Official Brand Warranty Included",
  },
};

const STORAGE_KEYS = {
  CUSTOMERS: "idk_raffle_customers_v1",
  DRAWS: "idk_raffle_draws_v1",
  NEXT_DRAW: "idk_raffle_next_draw_v1",
  PRIZES: "idk_raffle_prizes_v1",
};

let memoryCustomers: Customer[] = [...INITIAL_CUSTOMERS];
let memoryDraws: Draw[] = [...INITIAL_DRAWS];
let memoryNextDrawDate: string = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString();
let memoryPrizes: PrizeConfig = { ...DEFAULT_PRIZES };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadState() {
  if (isBrowser()) {
    try {
      const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (storedCustomers) {
        memoryCustomers = JSON.parse(storedCustomers);
      } else {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(memoryCustomers));
      }

      const storedDraws = localStorage.getItem(STORAGE_KEYS.DRAWS);
      if (storedDraws) {
        memoryDraws = JSON.parse(storedDraws);
      } else {
        localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(memoryDraws));
      }

      const storedNextDraw = localStorage.getItem(STORAGE_KEYS.NEXT_DRAW);
      if (storedNextDraw) {
        memoryNextDrawDate = storedNextDraw;
      } else {
        localStorage.setItem(STORAGE_KEYS.NEXT_DRAW, memoryNextDrawDate);
      }

      const storedPrizes = localStorage.getItem(STORAGE_KEYS.PRIZES);
      if (storedPrizes) {
        memoryPrizes = JSON.parse(storedPrizes);
      } else {
        localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(memoryPrizes));
      }
    } catch {
      // Fallback gracefully to memory
    }
  }
}

function persistState() {
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(memoryCustomers));
      localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(memoryDraws));
      localStorage.setItem(STORAGE_KEYS.NEXT_DRAW, memoryNextDrawDate);
      localStorage.setItem(STORAGE_KEYS.PRIZES, JSON.stringify(memoryPrizes));
    } catch {
      // ignore
    }
  }
}

/**
 * Generates a unique, high-contrast alphanumeric raffle ticket code
 */
export function generateRaffleCode(name?: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase())
        .slice(0, 2)
        .join("")
    : "TK";
  const alpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `RAFFLE-${num}-${initials || alpha}`;
}

export async function getCustomers(): Promise<Customer[]> {
  loadState();
  return [...memoryCustomers];
}

export async function getActiveCustomers(): Promise<Customer[]> {
  loadState();
  return memoryCustomers.filter((c) => c.status === "active");
}

export async function addCustomer(params: {
  name: string;
  phone: string;
  address: string;
  product: string;
  triggerSms?: boolean;
}): Promise<Customer> {
  loadState();
  const code = generateRaffleCode(params.name);
  const newCustomer: Customer = {
    id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: params.name.trim(),
    phone: params.phone.trim(),
    address: params.address.trim(),
    product: params.product.trim(),
    code,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  memoryCustomers.unshift(newCustomer);
  persistState();

  if (params.triggerSms !== false) {
    await sendCode(newCustomer.phone, newCustomer.code);
  }

  return newCustomer;
}

export async function runSingleDrawSelection(position: 1 | 2 | 3, excludeCustomerIds: string[]): Promise<DrawWinner> {
  loadState();
  const activeList = memoryCustomers.filter(
    (c) => c.status === "active" && !excludeCustomerIds.includes(c.id)
  );

  if (activeList.length === 0) {
    throw new Error("No eligible customers left to draw.");
  }

  // Pick one random customer
  const randomIndex = Math.floor(Math.random() * activeList.length);
  const selected = activeList[randomIndex];
  const prizes = memoryPrizes;

  let prize = prizes.third.title;
  if (position === 1) prize = prizes.first.title;
  if (position === 2) prize = prizes.second.title;

  return {
    position,
    customerId: selected.id,
    name: selected.name,
    code: selected.code,
    prize,
  };
}

export async function runDrawSelection(): Promise<DrawWinner[]> {
  loadState();
  const activeList = memoryCustomers.filter((c) => c.status === "active");

  if (activeList.length < 3) {
    throw new Error(
      `Insufficient active customers. At least 3 active customers required to run a draw (currently ${activeList.length} active).`
    );
  }

  // Fisher-Yates shuffle a shallow copy
  const shuffled = [...activeList];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, 3);
  const prizes = memoryPrizes;

  const winners: DrawWinner[] = [
    {
      position: 1,
      customerId: selected[0].id,
      name: selected[0].name,
      code: selected[0].code,
      prize: prizes.first.title,
    },
    {
      position: 2,
      customerId: selected[1].id,
      name: selected[1].name,
      code: selected[1].code,
      prize: prizes.second.title,
    },
    {
      position: 3,
      customerId: selected[2].id,
      name: selected[2].name,
      code: selected[2].code,
      prize: prizes.third.title,
    },
  ];

  return winners;
}

export async function saveDrawResult(title: string, winners: DrawWinner[]): Promise<Draw> {
  loadState();
  const newDraw: Draw = {
    id: `draw-${Date.now()}`,
    date: new Date().toISOString(),
    title: title.trim() || `Grand Loyalty Draw #${memoryDraws.length + 1}`,
    winners,
  };

  // Mark winning customers as "won"
  const winningCustomerIds = new Set(winners.map((w) => w.customerId));
  memoryCustomers = memoryCustomers.map((c) => {
    if (winningCustomerIds.has(c.id)) {
      return { ...c, status: "won" };
    }
    return c;
  });

  memoryDraws.unshift(newDraw);
  
  // Set next draw date 14 days out
  memoryNextDrawDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  persistState();

  return newDraw;
}

export async function getPastDraws(): Promise<Draw[]> {
  loadState();
  return [...memoryDraws];
}

export async function getNextDrawDate(): Promise<string> {
  loadState();
  return memoryNextDrawDate;
}

export async function saveNextDrawDate(isoString: string): Promise<string> {
  loadState();
  memoryNextDrawDate = isoString;
  persistState();
  return memoryNextDrawDate;
}

export async function getPrizes(): Promise<PrizeConfig> {
  loadState();
  return { ...memoryPrizes };
}

export async function savePrizes(newPrizes: PrizeConfig): Promise<PrizeConfig> {
  loadState();
  memoryPrizes = { ...newPrizes };
  persistState();
  return memoryPrizes;
}

export async function resetToDefaultData(): Promise<void> {
  memoryCustomers = [...INITIAL_CUSTOMERS];
  memoryDraws = [...INITIAL_DRAWS];
  memoryPrizes = { ...DEFAULT_PRIZES };
  memoryNextDrawDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString();
  persistState();
}

export async function deleteCustomer(id: string): Promise<void> {
  loadState();
  memoryCustomers = memoryCustomers.filter(c => c.id !== id);
  persistState();
}

export async function sendTicketSmsNotification(
  phone: string,
  code: string,
  name: string
): Promise<boolean> {
  // Simulate instant carrier SMS dispatch
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.log(`[SMS GATEWAY] Dispatched ticket code ${code} to ${phone} for ${name}`);
  return true;
}

