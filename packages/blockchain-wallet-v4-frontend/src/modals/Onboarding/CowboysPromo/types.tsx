import { FC } from 'react'

type CowboysFlyoutProps = {
  handleClose: () => void
  setStep: React.Dispatch<React.SetStateAction<CowboysPromoStepsType>>
}

type SignupComponentProps = CowboysFlyoutProps
type RaffleEnteredComponentProps = CowboysFlyoutProps
type VerifyIdComponentProps = Omit<CowboysFlyoutProps, 'setStep'>

export type CowboysPromoStepsType = 'signup' | 'raffleEntered' | 'verifyId'

export type SignupComponent = FC<SignupComponentProps>
export type RaffleEnteredComponent = FC<RaffleEnteredComponentProps>
export type VerifyIdComponent = FC<VerifyIdComponentProps>
