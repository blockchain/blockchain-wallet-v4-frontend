import * as AT from './actionTypes'

export const fetchQuote = (data) => ({ type: AT.COINIFY_FETCH_QUOTE, payload: data })
export const fetchQuoteLoading = () => ({ type: AT.COINIFY_FETCH_QUOTE_LOADING })
export const fetchQuoteSuccess = (data) => ({ type: AT.COINIFY_FETCH_QUOTE_SUCCESS, payload: data })
export const fetchQuoteFailure = (error) => ({ type: AT.COINIFY_FETCH_QUOTE_FAILURE, payload: error })

export const fetchQuoteAndMediums = (data) => ({ type: AT.COINIFY_FETCH_QUOTE_AND_MEDIUMS, payload: data })

export const fetchRateQuote = (currency, type) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE, payload: { currency, type } })
export const fetchRateQuoteLoading = () => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_LOADING })
export const fetchRateQuoteSuccess = (data) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_SUCCESS, payload: data })
export const fetchRateQuoteFailure = (error) => ({ type: AT.COINIFY_FETCH_RATE_QUOTE_FAILURE, payload: error })

export const fetchTrades = (data) => ({ type: AT.COINIFY_FETCH_TRADES, payload: data })
export const fetchTradesLoading = () => ({ type: AT.COINIFY_FETCH_TRADES_LOADING })
export const fetchTradesSuccess = (data) => ({ type: AT.COINIFY_FETCH_TRADES_SUCCESS, payload: data })
export const fetchTradesFailure = (error) => ({ type: AT.COINIFY_FETCH_TRADES_FAILURE, payload: error })

export const coinifyFetchProfile = () => ({ type: AT.COINIFY_FETCH_PROFILE })
export const coinifyFetchProfileLoading = () => ({ type: AT.COINIFY_FETCH_PROFILE_LOADING })
export const coinifyFetchProfileSuccess = (data) => ({ type: AT.COINIFY_FETCH_PROFILE_SUCCESS, payload: data })
export const coinifyFetchProfileFailure = (error) => ({ type: AT.COINIFY_FETCH_PROFILE_FAILURE, payload: error })

export const handleTrade = (data) => ({ type: AT.HANDLE_TRADE, payload: data })
export const handleTradeLoading = () => ({ type: AT.HANDLE_TRADE_LOADING })
export const handleTradeSuccess = (data) => ({ type: AT.HANDLE_TRADE_SUCCESS, payload: data })
export const handleTradeFailure = (error) => ({ type: AT.HANDLE_TRADE_FAILURE, payload: error })

export const setProfile = (data) => ({ type: AT.SET_PROFILE, payload: data })
export const setProfileSuccess = (data) => ({ type: AT.SET_PROFILE_SUCCESS, payload: data })
export const setProfileFailure = (error) => ({ type: AT.SET_PROFILE_FAILURE, payload: error })

export const signup = () => ({ type: AT.SIGNUP })
export const coinifySignupSuccess = (data) => ({ type: AT.COINIFY_SIGNUP_SUCCESS, payload: data })
export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const resetProfile = () => ({ type: AT.RESET_PROFILE })

export const getDelegateTokenSuccess = (token) => ({ type: AT.GET_DELEGATE_TOKEN_SUCCESS, token })

export const coinifySetToken = (token) => ({ type: AT.COINIFY_SET_TOKEN, payload: token })

export const getPaymentMediums = (quote) => ({ type: AT.COINIFY_GET_PAYMENT_MEDIUMS, payload: quote })
export const getPaymentMediumsLoading = () => ({ type: AT.COINIFY_GET_PAYMENT_MEDIUMS_LOADING })
export const getPaymentMediumsSuccess = (mediums) => ({ type: AT.COINIFY_GET_PAYMENT_MEDIUMS_SUCCESS, payload: mediums })
export const getPaymentMediumsFailure = (error) => ({ type: AT.COINIFY_GET_PAYMENT_MEDIUMS_FAILURE, payload: error })

export const getMediumAccounts = (medium) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS, payload: medium })
export const getMediumAccountsLoading = () => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_LOADING })
export const getMediumAccountsSuccess = (accounts) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_SUCCESS, payload: accounts })
export const getMediumAccountsFailure = (error) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_FAILURE, payload: error })

export const getMediumsWithBankAccounts = (quote) => ({ type: AT.COINIFY_GET_BANK_ACCOUNTS, payload: quote })

export const addBankAccount = (medium, account) => ({ type: AT.COINIFY_ADD_BANK_ACCOUNT, payload: { medium, account } })
export const addBankAccountFailure = (error) => ({ type: AT.COINIFY_ADD_BANK_ACCOUNT_FAILURE, payload: error })
export const addBankAccountLoading = () => ({ type: AT.COINIFY_ADD_BANK_ACCOUNT_LOADING })
export const addBankAccountSuccess = (account) => ({ type: AT.COINIFY_ADD_BANK_ACCOUNT_SUCCESS, payload: account })

export const setBankAccount = (account) => ({ type: AT.COINIFY_SET_BANK_ACCOUNT, payload: account })

export const initiateBuy = (data) => ({ type: AT.COINIFY_BUY, payload: data })

export const initiateSell = () => ({ type: AT.COINIFY_SELL })

export const cancelTrade = (trade) => ({ type: AT.COINIFY_CANCEL_TRADE, payload: trade })

export const getKycs = () => ({ type: AT.GET_KYCS })
export const getKYCsLoading = () => ({ type: AT.GET_KYCS_LOADING })
export const getKYCsSuccess = (kycs) => ({ type: AT.GET_KYCS_SUCCESS, payload: kycs })
export const getKYCsFailure = (error) => ({ type: AT.GET_KYCS_FAILURE, payload: error })
