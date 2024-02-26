export enum SpinnerEvents {
  SPINNER_TIMED_OUT = 'Spinner Timed Out'
}

export type SpinnerActions = {
  key: SpinnerEvents
  properties: {
    endpoint: string
    screen: string
    timeout: number
  }
}
