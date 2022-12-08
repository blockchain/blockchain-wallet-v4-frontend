import z from 'zod'

import type {
  DexAmount,
  DexChain,
  DexChainNativeCurrency,
  DexQuote,
  DexSwapQuote,
  DexSwapQuoteType,
  DexToken,
  DexTransaction,
  DexVenueName
} from './types'

// TODO: Move somewhere to utils
const stringToPositiveFloat = z.preprocess(
  (v) => parseFloat(z.string().parse(v)),
  z.number().positive()
)

export const listSchema = <T>(
  schema: z.ZodSchema<T, z.ZodTypeDef, unknown>
): z.ZodSchema<T[], z.ZodTypeDef, unknown> => z.array(schema)

const VenueNameSchema: z.ZodSchema<DexVenueName, z.ZodTypeDef, unknown> = z.literal('ZEROX')
const DexSwapQuoteTypeSchema: z.ZodSchema<DexSwapQuoteType, z.ZodTypeDef, unknown> =
  z.literal('SINGLE')

const DexChainNativeCurrencySchema: z.ZodSchema<DexChainNativeCurrency, z.ZodTypeDef, unknown> =
  z.object({
    address: z.string(),
    chainId: z.number(),
    decimals: z.number(),
    name: z.string(),
    symbol: z.string()
  })

export const DexChainSchema: z.ZodSchema<DexChain, z.ZodTypeDef, unknown> = z.object({
  chainId: z.number(),
  name: z.string(),
  nativeCurrency: DexChainNativeCurrencySchema
})

export const DexTokenSchema: z.ZodSchema<DexToken, z.ZodTypeDef, unknown> = z
  .object({
    address: z.string(),
    chainId: z.number(),
    decimals: z.number(),
    isNative: z.boolean(),
    name: z.string(),
    symbol: z.string(),
    verifiedBy: z.number()
  })
  .transform(({ isNative, ...result }) =>
    isNative ? { type: 'NATIVE', ...result } : { type: 'NOT_NATIVE', ...result }
  )

const DexAmountSchema: z.ZodSchema<DexAmount, z.ZodTypeDef, unknown> = z.object({
  address: z.string(),
  amount: stringToPositiveFloat,
  chainId: z.number(),
  minAmount: stringToPositiveFloat,
  symbol: z.string()
})

const DexQuoteSchema: z.ZodSchema<DexQuote, z.ZodTypeDef, unknown> = z.object({
  buyAmount: DexAmountSchema,
  buyTokenFee: stringToPositiveFloat,
  buyTokenPercentageFee: stringToPositiveFloat,
  estimatedPriceImpact: stringToPositiveFloat,
  guaranteedPrice: stringToPositiveFloat,
  price: stringToPositiveFloat,
  sellAmount: DexAmountSchema
})

const DexTransactionSchema: z.ZodSchema<DexTransaction, z.ZodTypeDef, unknown> = z.object({
  allowanceTarget: z.string(),
  chainId: z.number(),
  data: z.string(),
  gasLimit: stringToPositiveFloat,
  gasPrice: stringToPositiveFloat,
  to: z.string(),
  value: stringToPositiveFloat
})

export const DexSwapQuoteSchema: z.ZodSchema<DexSwapQuote, z.ZodTypeDef, unknown> = z
  .object({
    legs: z.literal(1),
    quotes: z.array(DexQuoteSchema).length(1),
    txs: z.array(DexTransactionSchema).length(1),
    type: DexSwapQuoteTypeSchema,
    venue: VenueNameSchema
  })
  .transform(({ quotes, txs, ...result }) => ({
    quote: quotes[0],
    transaction: txs[0],
    ...result
  }))

export const DexUserEligibilitySchema: z.ZodSchema<boolean, z.ZodTypeDef, unknown> = z
  .object({
    isEligible: z.boolean()
  })
  .transform(({ isEligible }) => isEligible)
