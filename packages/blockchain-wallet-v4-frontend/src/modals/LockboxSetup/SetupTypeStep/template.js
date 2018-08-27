import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 15px;
`

const OptionsStep = props => {
  const { handleStepChange } = props
  return (
    <React.Fragment>
      <Row>
        <Button nature='primary' fullwidth onClick={() => handleStepChange()}>
          <FormattedMessage
            id='modals.lockboxsetup.firststep.link'
            defaultMessage='Link a new device'
          />
        </Button>
      </Row>
      <Row>
        <Button nature='primary' fullwidth>
          <FormattedMessage
            id='modals.lockboxsetup.firststep.restore'
            defaultMessage='Restore an existing device'
          />
        </Button>
      </Row>
      <Row>
        <Button nature='primary' fullwidth>
          <FormattedMessage
            id='modals.lockboxsetup.firststep.buy'
            defaultMessage='Buy a new Lockbox'
          />
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default OptionsStep
