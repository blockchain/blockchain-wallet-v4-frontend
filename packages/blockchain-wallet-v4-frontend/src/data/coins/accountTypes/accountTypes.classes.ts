/* eslint-disable max-classes-per-file */
import { CallEffect, SelectEffect } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { CoinType, RemoteDataType } from '@core/types'
import { RootState } from 'data/rootReducer'
import { RequestExtrasType, SwapAccountType } from 'data/types'

export enum CoinAccountTypeEnum {
  CUSTODIAL = 'CUSTODIAL',
  DYNAMIC_SELF_CUSTODY = 'DYNAMIC_SELF_CUSTODY',
  ERC20 = 'ERC20',
  NON_CUSTODIAL = 'NON_CUSTODIAL'
}

export class AccountTypeClass {
  api: APIType

  networks: any

  constructor(api: APIType, networks) {
    this.api = api
    this.networks = networks
  }

  getNextReceiveAddress: (
    coin: CoinType,
    index?: number
  ) => Generator<
    CallEffect<unknown> | SelectEffect,
    { address?: string; extras?: RequestExtrasType } | undefined,
    any
  >

  getAccounts: (state: RootState, ownProps: any) => RemoteDataType<string, SwapAccountType[]>
}

export class NonCustodialAccountTypeClass extends AccountTypeClass {
  getDefaultAccount: (coin: string) => Generator<SelectEffect, any, unknown>

  getOrUpdateProvisionalPayment: (
    coreSagas: any,
    paymentR: any,
    coin: string
  ) => Generator<any, any, unknown>
}
