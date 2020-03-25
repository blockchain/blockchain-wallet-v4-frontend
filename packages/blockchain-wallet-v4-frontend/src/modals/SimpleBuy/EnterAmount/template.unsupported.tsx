import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Text } from 'blockchain-info-components'
import { LinkDispatchPropsType, OwnProps } from '.'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps & LinkDispatchPropsType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`

const Unsupported: React.FC<Props> = props => {
  return (
    <Top>
      <Icon
        cursor
        name='arrow-left'
        size='20px'
        color='grey600'
        onClick={() =>
          props.simpleBuyActions.setStep({ step: 'CURRENCY_SELECTION' })
        }
      />
      <Text>This is awkward...user not eligible</Text>
    </Top>
  )
}

export default Unsupported
