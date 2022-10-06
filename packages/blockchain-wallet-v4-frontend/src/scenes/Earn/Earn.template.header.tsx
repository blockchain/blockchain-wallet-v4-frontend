import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text, TooltipHost } from 'blockchain-info-components'
import { SceneHeader, SceneHeaderText, SceneSubHeaderText } from 'components/Layout'

const DisclaimerText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const SubheaderSeparator = styled.div`
  display: flex;
  flex-grow: 2;
`
const SceneSubHeaderTextCustom = styled(SceneSubHeaderText)`
  display: contents;
`
const EarnHeader = () => {
  return (
    <>
      <SceneHeader>
        <SceneHeaderText>
          <FormattedMessage id='copy.earn' defaultMessage='Earn' />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderTextCustom>
        <FormattedMessage
          defaultMessage='Get daily or monthly rewards on your crypto.'
          id='scenes.earn.subheader'
        />
        <SubheaderSeparator />
        <DisclaimerText>
          <TooltipHost id='scenes.interest.legaldisclaimer'>
            <Icon name='info' size='12px' color='grey400' />
            <Text size='12px' color='grey400' weight={500} style={{ margin: '-2px 0 0 5px' }}>
              <FormattedMessage
                id='scenes.interest.legaldiscalimer'
                defaultMessage='Legal disclaimer'
              />
            </Text>
          </TooltipHost>
        </DisclaimerText>
      </SceneSubHeaderTextCustom>
    </>
  )
}

export default EarnHeader
