export enum SpinnerEvents {
  SPINNER_LAUNCHED = 'Spinner Launched'
}

export type SpinnerEventAction = {
  key: SpinnerEvents
  properties: {
    duration: number
    endpoint: string
    screen: string
  }
}
