export const RESIDENTIAL_ADDRESS_FORM = 'residentialAddress'

export const SOCIAL_SECURITY_NUMBER_FORM = 'socialSecurityNumber'

export enum OrderCardStep {
  COMPLETE = 'COMPLETE',
  RESIDENTIAL_ADDRESS = 'RESIDENTIAL_ADDRESS',
  SELECT_CARD = 'SELECT_CARD',
  SSN = 'SSN'
}

export enum DebitCardError {
  NO_LEGAL_REQUIREMENTS = 'NO_LEGAL_REQUIREMENTS',
  NO_PRODUCT_CODE = 'NO_PRODUCT_CODE'
}
