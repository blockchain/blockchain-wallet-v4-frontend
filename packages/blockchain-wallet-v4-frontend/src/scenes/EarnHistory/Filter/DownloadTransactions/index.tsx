import React from 'react'
import { CSVLink } from 'react-csv'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import {
  Button,
  Flex,
  IconAlert,
  IconCheckCircle,
  IconDownload,
  SemanticColors,
  SpinningLoader,
  Text
} from '@blockchain-com/constellation'
import { flatten, map } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { EarnHistoryCoinFormType } from 'data/components/interest/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

const DownloadButton = styled(CSVLink)`
  text-decoration: none;
  border: 1px solid ${SemanticColors.medium};
  border-radius: 8px;
  padding: 0 24px;

  & > div {
    min-width: 100px;
  }

  ${media.mobile`
    width: calc(100% - 50px);
  `}
`

class DownloadTransactions extends React.PureComponent<Props> {
  state: StateProps = { hasSavedReport: false }

  componentDidUpdate(prevProps) {
    const { earnActions, formValues } = this.props

    if (prevProps.formValues?.coin !== formValues?.coin) {
      earnActions.clearInterestTransactionsReport()
      this.setState({ hasSavedReport: false }) // eslint-disable-line
    }
  }

  componentWillUnmount() {
    this.props.earnActions.clearInterestTransactionsReport()
  }

  handleDownload = () => {
    const {
      analyticsActions,
      earnActions,
      formValues: { coin }
    } = this.props
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_TRANSACTION_HISTORY_DOWNLOAD_CLICKED,
      properties: {
        currency: coin
      }
    })
    earnActions.fetchEarnTransactionsReport()
  }

  handleSaveReport = () => {
    this.setState({ hasSavedReport: true })
  }

  render() {
    const { isMobile, transactionsReportR, txPages } = this.props
    const txList = flatten(
      txPages &&
        // @ts-ignore
        txPages.map((pages) => map((page) => page, (pages && pages.data) || []))
    )

    return (
      txList?.length > 0 &&
      transactionsReportR.cata({
        Failure: () => (
          <Button
            as='button'
            size='default'
            state='initial'
            text={<IconAlert size='medium' color={SemanticColors.error} />}
            variant='minimal'
            width={isMobile ? 'full' : 'auto'}
          />
        ),
        Loading: () => (
          <Button
            as='button'
            onClick={this.handleDownload}
            size='default'
            state='initial'
            text={<SpinningLoader borderWidth='small' size='small' variant='color' />}
            variant='minimal'
            width={isMobile ? 'full' : 'auto'}
          />
        ),
        NotAsked: () => (
          <Button
            as='button'
            onClick={this.handleDownload}
            size='default'
            state='initial'
            text={<IconDownload size='medium' color={SemanticColors.primary} />}
            variant='minimal'
            width={isMobile ? 'full' : 'auto'}
          />
        ),
        Success: (val) => {
          // potential race condition in render - ensure data is always valid for csv
          const valResults = Array.isArray(val) ? val : [[], []]
          return this.state.hasSavedReport ? (
            <Button
              as='button'
              size='default'
              state='initial'
              text={<IconCheckCircle size='medium' color={SemanticColors.success} />}
              variant='minimal'
              width={isMobile ? 'full' : 'auto'}
            />
          ) : (
            <DownloadButton
              data={valResults}
              filename='Interest_Transactions.csv'
              onClick={this.handleSaveReport}
              target='_blank'
              width='100%'
            >
              <Flex alignItems='center' justifyContent='center' gap={8}>
                <IconDownload size='small' color={SemanticColors.primary} />
                <Text color={SemanticColors.primary} variant='body2'>
                  <FormattedMessage
                    id='scenes.interest.transactions.savefile'
                    defaultMessage='Save file'
                  />
                </Text>
              </Flex>
            </DownloadButton>
          )
        }
      })
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('earnHistoryCoin')(state) as EarnHistoryCoinFormType,
  transactionsReportR: selectors.components.interest.getInterestTransactionsReport(state),
  txPages: selectors.components.interest.getEarnTransactions(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type Props = ConnectedProps<typeof connector> & { isMobile: boolean }
type StateProps = {
  hasSavedReport: boolean
}

export default connector(DownloadTransactions)
