import * as AT from './actionTypes'

export const fetchQuote = (data) => ({ type: AT.COINIFY_FETCH_QUOTE, payload: data })
export const fetchQuoteLoading = () => ({ type: AT.COINIFY_FETCH_QUOTE_LOADING })
export const fetchQuoteSuccess = (data) => ({ type: AT.COINIFY_FETCH_QUOTE_SUCCESS, payload: data })
export const fetchQuoteFailure = (error) => ({ type: AT.COINIFY_FETCH_QUOTE_FAILURE, payload: error })

export const fetchTrades = (data) => ({ type: AT.FETCH_TRADES, payload: data })
export const fetchTradesLoading = () => ({ type: AT.FETCH_TRADES_LOADING })
export const fetchTradesSuccess = (data) => ({ type: AT.FETCH_TRADES_SUCCESS, payload: data })
export const fetchTradesFailure = (error) => ({ type: AT.FETCH_TRADES_FAILURE, payload: error })

export const fetchProfile = () => ({ type: AT.COINIFY_FETCH_PROFILE })
export const fetchProfileLoading = () => ({ type: AT.COINIFY_FETCH_PROFILE_LOADING })
export const fetchProfileSuccess = (data) => ({ type: AT.COINIFY_FETCH_PROFILE_SUCCESS, payload: data })
export const fetchProfileFailure = (error) => ({ type: AT.COINIFY_FETCH_PROFILE_FAILURE, payload: error })

export const fetchAccounts = () => ({ type: AT.FETCH_ACCOUNTS, payload: {} })
export const fetchAccountsLoading = () => ({ type: AT.FETCH_ACCOUNTS_LOADING })
export const fetchAccountsSuccess = (data) => ({ type: AT.FETCH_ACCOUNTS_SUCCESS, payload: data })
export const fetchAccountsFailure = (error) => ({ type: AT.FETCH_ACCOUNTS_FAILURE, payload: error })

export const handleTrade = (data) => ({ type: AT.HANDLE_TRADE, payload: data })
export const handleTradeLoading = () => ({ type: AT.HANDLE_TRADE_LOADING })
export const handleTradeSuccess = (data) => ({ type: AT.HANDLE_TRADE_SUCCESS, payload: data })
export const handleTradeFailure = (error) => ({ type: AT.HANDLE_TRADE_FAILURE, payload: error })

export const setProfile = (data) => ({ type: AT.SET_PROFILE, payload: data })
export const setProfileSuccess = (data) => ({ type: AT.SET_PROFILE_SUCCESS, payload: data })
export const setProfileFailure = (error) => ({ type: AT.SET_PROFILE_FAILURE, payload: error })

export const getBankAccounts = (token) => ({ type: AT.GET_BANK_ACCOUNTS, payload: token })
export const getBankAccountsSuccess = (accounts) => ({ type: AT.GET_BANK_ACCOUNTS_SUCCESS, payload: accounts })
export const getBankAccountsFailure = (error) => ({ type: AT.GET_BANK_ACCOUNTS_FAILURE, payload: error })

export const setBankAccount = (data) => ({ type: AT.SET_BANK_ACCOUNT, payload: data })
export const setBankAccountSuccess = () => ({ type: AT.SET_BANK_ACCOUNT_SUCCESS })
export const setBankAccountFailure = (error) => ({ type: AT.SET_BANK_ACCOUNT_FAILURE, payload: error })

export const setBankManually = (data) => ({ type: AT.SET_BANK_MANUALLY, payload: data })
export const setBankManuallySuccess = () => ({ type: AT.SET_BANK_MANUALLY_SUCCESS })
export const setBankManuallyFailure = (error) => ({ type: AT.SET_BANK_MANUALLY_FAILURE, payload: error })

export const signup = () => ({ type: AT.SIGNUP })
export const coinifySignupSuccess = (data) => ({ type: AT.COINIFY_SIGNUP_SUCCESS, payload: data })
export const coinifySignupFailure = (error) => ({ type: AT.COINIFY_SIGNUP_FAILURE, payload: error })

export const resetProfile = () => ({ type: AT.RESET_PROFILE })

export const getDelegateTokenSuccess = (token) => ({ type: AT.GET_DELEGATE_TOKEN_SUCCESS, token })

export const coinifySetToken = (token) => ({ type: AT.COINIFY_SET_TOKEN, payload: token })

export const getPaymentMediums = (quote) => ({ type: AT.GET_PAYMENT_MEDIUMS, payload: quote })
export const getPaymentMediumsLoading = () => ({ type: AT.GET_PAYMENT_MEDIUMS_LOADING })
export const getPaymentMediumsSuccess = (mediums) => ({ type: AT.GET_PAYMENT_MEDIUMS_SUCCESS, payload: mediums })
export const getPaymentMediumsFailure = (error) => ({ type: AT.GET_PAYMENT_MEDIUMS_FAILURE, payload: error })

export const getMediumAccounts = (medium) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS, payload: medium })
export const getMediumAccountsSuccess = (accounts) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_SUCCESS, payload: accounts })
export const getMediumAccountsFailure = (error) => ({ type: AT.COINIFY_GET_MEDIUM_ACCOUNTS_FAILURE, payload: error })
