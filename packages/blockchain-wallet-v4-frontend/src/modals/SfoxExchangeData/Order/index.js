import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { merge } from 'ramda'
import { actions, selectors } from 'data'
import { Row, ColLeft, ColRight, ColLeftInner, Title, Subtitle } from '../styled'
import DecisionForm from './DecisionForm'
import QuoteInput from './QuoteInput'
import { Button } from 'blockchain-info-components'
import { Faq, FaqHeader, FaqContent } from 'components/FaqItem'

class Order extends Component {
  constructor (props) {
    super(props)
    this.state = {
      spec: {
        method: null,
        output: null,
        input: null
      },
      info: {
        toggledCurrs: false,
        toggledLimits: false
      }
    }
    this.handleChangeSpec = this.handleChangeSpec.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleToggleInfo = this.handleToggleInfo.bind(this)
  }

  componentWillMount () {
    this.props.sfoxCore.clearQuote()
  }

  isSpecComplete () {
    let { spec } = this.state
    return spec.method && spec.output && spec.input
  }

  handleChangeSpec (spec) {
    this.setState({ spec })
  }

  handleContinue () {
    this.props.sfox.nextStep('submit')
  }

  handleToggleInfo (name) {
    return () => this.setState({
      info: merge(this.state.info, {
        [name]: !this.state.info[name]
      })
    })
  }

  render () {
    let { quoteR, sfoxCore } = this.props
    let { spec, info } = this.state

    return (
      <Row>
        <ColLeft>
          <ColLeftInner>
            <Title>
              <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Create Your Order' />
            </Title>
            <Subtitle>
              <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='You can buy or sell any of the available currencies.' />
            </Subtitle>
            <DecisionForm fiat='USD' spec={spec} onChange={this.handleChangeSpec} />
            {this.isSpecComplete() && (
              <QuoteInput quoteR={quoteR} spec={spec} debounce={500} onFetchQuote={sfoxCore.fetchQuote} />
            )}
          </ColLeftInner>
        </ColLeft>
        <ColRight>
          <Button nature='primary' fullwidth disabled={quoteR.map(() => false).getOrElse(true)} onClick={this.handleContinue}>
            <FormattedMessage id='continue' defaultMessage='Continue' />
          </Button>
          <Faq>
            <FaqHeader toggled={info.toggledCurrs} handleToggle={this.handleToggleInfo('toggledCurrs')}>
              <FormattedMessage id='placeholder' defaultMessage='Which currencies can I buy?' />
            </FaqHeader>
            <FaqContent toggled={info.toggledCurrs}>
              <FormattedMessage id='placeholder' defaultMessage='All of them!' />
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader toggled={info.toggledLimits} handleToggle={this.handleToggleInfo('toggledLimits')}>
              <FormattedMessage id='placeholder' defaultMessage='How do I raise my limits?' />
            </FaqHeader>
            <FaqContent toggled={info.toggledLimits}>
              <FormattedMessage id='placeholder' defaultMessage='KYC!' />
            </FaqContent>
          </Faq>
        </ColRight>
      </Row>
    )
  }
}

const mapState = (state) => ({
  quoteR: selectors.core.data.sfox.getQuote(state)
})

const mapDispatch = (dispatch) => ({
  sfox: bindActionCreators(actions.modules.sfox, dispatch),
  sfoxCore: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default connect(mapState, mapDispatch)(Order)
