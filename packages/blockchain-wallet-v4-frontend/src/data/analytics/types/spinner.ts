export enum SpinnerEvents {
  SPINNER_TIMED_OUT = 'Spinner Timed Out'
}

export type SpinnerEventAction = {
  key: SpinnerEvents
  properties: {
    endpoint: string
    screen: string
    timeout: number
  }
}
