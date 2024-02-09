export enum MiscEvents {
  CREATE_YOUR_ACCOUNT_VIEWED = 'Create Your Account Viewed',
  CUSTOMER_SUPPORT_CLICKED = 'Customer Support Clicked',
  SIGNUP_VIEWED = 'Signup Viewed',
  WRONG_CHANGE_CACHE = 'Wrong Change Cache',
  WRONG_RECEIVE_CACHE = 'Wrong Receive Cache'
}

export type MiscActions = {
  key: MiscEvents
  properties: {}
}
