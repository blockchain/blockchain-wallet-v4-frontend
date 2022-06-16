import React from 'react'

import { CountryType, GoalsType, StateType } from 'data/types'

import { Props as OwnProps } from '.'

export type SignupFormInitValuesType = {
  country?: string
  email?: string
}
export type GeoLocationType = {
  countryCode: string
  headerBlockchainCFIpCountry: string
  headerBlockchainGoogleIpCountry: string
  headerBlockchainGoogleIpRegion: string
  ip: string
}
export type SignupFormType = {
  country: CountryType
  email: string
  password: string
  state: StateType
}
export type GoalDataType = Array<{
  data: never
  id: string
  name: GoalsType
}>

// common props used by all subviews
export type SubviewProps = {
  isFormSubmitting: boolean
  isLinkAccountGoal: boolean
  onCountrySelect: (e: React.ChangeEvent<any> | undefined, value: CountryType) => void
  onSignupSubmit: (e: React.SyntheticEvent, value: string) => void
  showForm: boolean
  showState: boolean
  toggleSignupFormVisibility: () => void
} & OwnProps
