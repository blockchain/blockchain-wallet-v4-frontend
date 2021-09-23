import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text, TooltipHost } from 'blockchain-info-components'
import { IconBackground, SceneHeader, SceneHeaderText, SceneSubHeaderText } from 'components/Layout'

const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.blue600};
`
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
const InterestHeader = () => {
  return (
    <>
      <SceneHeader>
        <IconBackground>
          <Icon color='blue600' name='percentage' size='24px' />
        </IconBackground>
        <SceneHeaderText>
          <FormattedMessage id='scenes.interest.interestaccount' defaultMessage='Rewards Account' />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderTextCustom>
        <FormattedMessage
          id='scenes.interest.subheader'
          defaultMessage='Deposit crypto and watch it grow. Rewards are paid by the end of the day on the 1st of each month.'
        />
        <LearnMoreLink
          href='https://support.blockchain.com/hc/en-us/articles/360043658491-How-the-Interest-Account-works'
          target='_blank'
        >
          <LearnMoreText size='16px'>
            <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
          </LearnMoreText>
        </LearnMoreLink>
        <SubheaderSeparator />
        <DisclaimerText>
          <TooltipHost id='scenes.interest.legaldisclaimer'>
            <Icon name='info' size='12px' color='blue600' />
            <Text size='12px' color='blue600' weight={500} style={{ margin: '-2px 0 0 5px' }}>
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

export default InterestHeader
