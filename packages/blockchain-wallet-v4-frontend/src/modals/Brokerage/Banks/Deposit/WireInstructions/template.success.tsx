import React from 'react'
import styled from 'styled-components'

import { Props as OwnProps, SuccessStateType } from '.'
import LayoutDefault from './CurrencyLayouts/default'
import LayoutUsdArs from './CurrencyLayouts/LayoutUsdArs'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Success: React.FC<Props> = (props) => {
  const userCountryCode = props.userData?.address?.country || 'default'

  const currencyLayouts = {
    ARS: <LayoutUsdArs {...props} />,
    USD: userCountryCode !== 'AR' ? <LayoutDefault {...props} /> : <LayoutUsdArs {...props} />,
    default: <LayoutDefault {...props} />
  }

  return (
    <Wrapper>
      {currencyLayouts[props.account.currency]
        ? currencyLayouts[props.account.currency]
        : currencyLayouts.default}
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
