export type TermsAndConditionType = {
  termsAndConditions: string
}

export type LocationAddress = {
  description: string
  highlight: string
  id: string
  text: string
  type: 'Container' | 'Address'
}

export type FindAddressResponse = {
  addresses: Array<LocationAddress>
}

export type RetrieveAddress = {
  adminAreaCode: string
  adminAreaName: string
  barcode: string
  block: string
  buildingName: string
  buildingNumber: string
  city: string
  company: string
  countryIso2: string
  countryIso3: string
  countryIsoNumber: string
  countryName: string
  dataLevel: string
  department: string
  district: string
  domesticId: string
  id: string
  label: string
  language: string
  languageAlternatives: string
  line1: string
  line2: string
  line3: string
  line4: string
  line5: string
  neighbourhood: string
  poBoxNumber: string
  postalCode: string
  province: string
  provinceCode: string
  provinceName: string
  secondaryStreet: string
  sortingNumber1: string
  sortingNumber2: string
  street: string
  subBuilding: string
  type: string
}

type FlowItem = {
  name: string
}

export type UserRiskSettings = {
  flows: Array<FlowItem>
}
