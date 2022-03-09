import { RemoteDataType, TermsAndConditionType } from '@core/types'

export type TermsAndConditionsState = {
  termsAndConditions: RemoteDataType<string, TermsAndConditionType>
}
