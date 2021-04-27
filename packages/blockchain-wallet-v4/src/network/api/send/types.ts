export type UnstoppableDomainResultsType = {
  metadata: {
    resolver: string
    type: 'CNS'
  }
  results: {
    address: string
    currency: string
    ttl: number
  }[]
}
