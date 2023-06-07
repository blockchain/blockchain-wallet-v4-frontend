import z from 'zod'

import type {
  BuildDexTx,
  BuildDexTxPreImage,
  BuildDexTxRawTx,
  BuildDexTxSummary,
  DexBuyAmount,
  DexChain,
  DexQuote,
  DexSellAmount,
  DexSwapQuote,
  DexSwapQuoteType,
  DexToken,
  DexTokenAllowance,
  DexTokenNative,
  DexTokenNotNative,
  DexTransaction,
  DexVenueType
} from './types'

// TODO: Move somewhere to utils
const stringToPositiveFloat = z.preprocess(
  (v) => parseFloat(z.string().parse(v)),
  z.number().positive()
)

export const listSchema = <T>(
  schema: z.ZodSchema<T, z.ZodTypeDef, unknown>
): z.ZodSchema<T[], z.ZodTypeDef, unknown> => z.array(schema)

const DexVenueTypeSchema: z.ZodSchema<DexVenueType, z.ZodTypeDef, unknown> = z.literal('AGGREGATOR')
const DexSwapQuoteTypeSchema: z.ZodSchema<DexSwapQuoteType, z.ZodTypeDef, unknown> =
  z.literal('SINGLE')

const DexTokenNativeSchema: z.ZodSchema<DexTokenNative, z.ZodTypeDef, unknown> = z
  .object({
    address: z.string(),
    chainId: z.number(),
    decimals: z.number(),
    name: z.string(),
    symbol: z.string()
  })
  .transform((data) => ({ type: 'NATIVE', ...data }))

const DexTokenNotNativeSchema: z.ZodSchema<DexTokenNotNative, z.ZodTypeDef, unknown> = z
  .object({
    address: z.string(),
    chainId: z.number(),
    decimals: z.number(),
    isNative: z.optional(z.boolean()),
    name: z.string(),
    symbol: z.string(),
    verifiedBy: z.number()
  })
  .transform(({ isNative, ...result }) => ({ type: 'NOT_NATIVE', ...result }))

export const DexTokenSchema: z.ZodSchema<DexToken, z.ZodTypeDef, unknown> = z.union([
  DexTokenNativeSchema,
  DexTokenNotNativeSchema
])

export const DexChainSchema: z.ZodSchema<DexChain, z.ZodTypeDef, unknown> = z.object({
  chainId: z.number(),
  name: z.string(),
  nativeCurrency: DexTokenNativeSchema
})

const DexBuyAmountSchema: z.ZodSchema<DexBuyAmount, z.ZodTypeDef, unknown> = z
  .object({
    address: z.string(),
    amount: stringToPositiveFloat,
    chainId: z.number(),
    minAmount: stringToPositiveFloat,
    symbol: z.string()
  })
  .transform((data) => ({ type: 'BUY', ...data }))

const DexSellAmountSchema: z.ZodSchema<DexSellAmount, z.ZodTypeDef, unknown> = z
  .object({
    address: z.string(),
    amount: stringToPositiveFloat,
    chainId: z.number(),
    symbol: z.string()
  })
  .transform((data) => ({ type: 'SELL', ...data }))

const DexQuoteSchema: z.ZodSchema<DexQuote, z.ZodTypeDef, unknown> = z.object({
  buyAmount: DexBuyAmountSchema,
  buyTokenFee: stringToPositiveFloat,
  buyTokenPercentageFee: stringToPositiveFloat,
  guaranteedPrice: stringToPositiveFloat,
  price: stringToPositiveFloat,
  sellAmount: DexSellAmountSchema
})

const DexTransactionSchema: z.ZodSchema<DexTransaction, z.ZodTypeDef, unknown> = z.object({
  allowanceTarget: z.string(),
  // TODO: Change to just z.number when it's fixed on BE
  chainId: z.union([z.number(), stringToPositiveFloat]),
  data: z.string(),
  gasLimit: z.string(),
  gasPrice: z.string(),
  to: z.string(),
  value: z.string()
})

const DexPreImageSchema: z.ZodSchema<BuildDexTxPreImage, z.ZodTypeDef, unknown> = z.object({
  descriptor: z.literal('legacy'),
  preImage: z.string(),
  signatureAlgorithm: z.literal('secp256k1'),
  signingKey: z.string()
})

const DexBuildRawTxSchema: z.ZodSchema<BuildDexTxRawTx, z.ZodTypeDef, unknown> = z.object({
  payload: z.object({
    chainId: z.number(),
    data: z.string(),
    gasLimit: z.object({
      hex: z.string(),
      type: z.literal('BigNumber')
    }),
    gasPrice: z.object({
      hex: z.string(),
      type: z.literal('BigNumber')
    }),
    nonce: z.number(),
    to: z.string(),
    value: z.object({
      hex: z.string(),
      type: z.literal('BigNumber')
    })
  }),
  version: z.number()
})

const BuildDexTxSummarySchema: z.ZodSchema<BuildDexTxSummary, z.ZodTypeDef, unknown> = z.object({
  absoluteFeeEstimate: z.string(),
  absoluteFeeMaximum: z.string(),
  relativeFee: z.string()
})

export const DexSwapQuoteSchema: z.ZodSchema<DexSwapQuote, z.ZodTypeDef, unknown> = z
  .object({
    legs: z.literal(1),
    quote: DexQuoteSchema,
    tx: DexTransactionSchema,
    type: DexSwapQuoteTypeSchema,
    venueType: DexVenueTypeSchema
  })
  .transform(({ tx, ...result }) => ({
    transaction: tx,
    ...result
  }))

export const DexUserEligibilitySchema: z.ZodSchema<boolean, z.ZodTypeDef, unknown> = z
  .object({
    eligible: z.boolean()
  })
  .transform(({ eligible }) => eligible)

export const DexTokenAllowanceSchema: z.ZodSchema<DexTokenAllowance, z.ZodTypeDef, unknown> =
  z.object({
    result: z.object({
      allowance: z.string()
    })
  })

export const BuildDexTxSchema: z.ZodSchema<BuildDexTx, z.ZodTypeDef, unknown> = z.object({
  preImages: DexPreImageSchema.array(),
  rawTx: DexBuildRawTxSchema,
  summary: BuildDexTxSummarySchema
})
