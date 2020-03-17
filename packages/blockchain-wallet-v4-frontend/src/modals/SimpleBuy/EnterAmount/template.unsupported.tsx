import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Text } from 'blockchain-info-components'
import { OwnProps } from '.'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`

const Unsupported: React.FC<Props> = props => {
  return (
    <Top>
      <Icon
        cursor
        name='close'
        size='20px'
        color='grey600'
        onClick={() => props.handleClose()}
      />
      <Text>This is awkward...user not eligible</Text>
    </Top>
  )
}

export default Unsupported
