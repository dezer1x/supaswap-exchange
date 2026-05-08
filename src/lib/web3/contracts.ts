// Contract addresses on Sepolia. Replace placeholders with real deployments.
export const ADDRESSES = {
  FACTORY: "0x0000000000000000000000000000000000000000" as const,
  ROUTER: "0x0000000000000000000000000000000000000000" as const,
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" as const,
  TOKEN_A: "0x0000000000000000000000000000000000000000" as const,
  TOKEN_B: "0x0000000000000000000000000000000000000000" as const,
  FAUCET: "0x0000000000000000000000000000000000000000" as const,
};

// Minimal Uniswap V2-style ABIs
export const ROUTER_ABI = [
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountADesired", type: "uint256" },
      { name: "amountBDesired", type: "uint256" },
      { name: "amountAMin", type: "uint256" },
      { name: "amountBMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "liquidity", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const FAUCET_ABI = [
  {
    inputs: [{ name: "token", type: "address" }],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" },
    ],
    name: "lastClaim",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type Token = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  color: string; // for gradient avatar
  faucetAmount?: string;
};

export const TOKENS: Token[] = [
  {
    address: ADDRESSES.WETH,
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    color: "from-indigo-400 to-violet-500",
  },
  {
    address: ADDRESSES.TOKEN_A,
    symbol: "USDT",
    name: "Test Tether",
    decimals: 6,
    color: "from-emerald-400 to-teal-500",
    faucetAmount: "1,000",
  },
  {
    address: ADDRESSES.TOKEN_B,
    symbol: "DUPA",
    name: "SupaDupa Token",
    decimals: 18,
    color: "from-fuchsia-400 to-purple-600",
    faucetAmount: "5,000",
  },
];
