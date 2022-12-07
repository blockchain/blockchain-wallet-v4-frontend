export enum ValidatorTypeEnum {
  ERROR = 'error',
  WARNING = 'warning'
}

export type ValidatorWithType = {
  type: ValidatorTypeEnum
  validate: (value: number) => JSX.Element | undefined
}

export type SlippageValue =
  | { isCustom: false; value: number }
  | { isCustom: true; message?: JSX.Element; messageType?: ValidatorTypeEnum; value: number }
