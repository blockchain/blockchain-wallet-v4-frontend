export type SlidePropsType = {
  description: JSX.Element
  image:
    | 'onboarding-active-rewards'
    | 'onboarding-earn'
    | 'onboarding-passive-rewards'
    | 'onboarding-staking-rewards'
  title: JSX.Element
}

export type GetContentArgsType = {
  isActiveEligible: boolean
  isPassiveEligible: boolean
  isStakingEligible: boolean
  maxPercentage: number
}
