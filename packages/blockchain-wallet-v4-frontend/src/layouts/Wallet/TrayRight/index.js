import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { contains } from 'ramda'

import { Icon, Text } from 'blockchain-info-components'
import Faq from './Faq'
import WhatsNew from './WhatsNew'
import { actions } from 'data'
import { getData } from './selectors'

const AnimationWrapper = styled.div`
  position: absolute;
  width: calc(33%);
  right: ${props => props.opened ? '0' : 'calc(-50%)'};
  height: calc(100vh - 60px);
  transition: right 0.4s linear;
  box-shadow: -5px 5px 20px ${props => props.theme['gray-4']};
  z-index: 20;

  @media (max-width: 991px) {
    width: calc(50%);
    right: ${props => props.opened ? '0' : 'calc(-75%)'};
  }

  @media (max-width: 767px) {
    width: calc(100%);
    right: ${props => props.opened ? '0' : 'calc(-110%)'};
  }
  @media (max-width: 480px) {
    width: calc(100%);
    right: ${props => props.opened ? '0' : 'calc(-110%)'};
    display: ${props => props.opened ? 'inline' : 'none'};
  }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
`
const Content = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  background-color: ${props => props.theme['white']};
`

class TrayRightContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClick)
  }

  handleClick (e) {
    const trayContainer = ReactDOM.findDOMNode(this.node)
    const blacklist = ['faq-icon', 'whatsnew-icon']
    if (trayContainer && !trayContainer.contains(e.target) && !contains(e.target.id, blacklist)) {
      this.handleClose()
    }
  }

  handleClose () {
    if (this.props.data.opened) {
      this.props.actions.layoutWalletTrayCloseClicked()
    }
  }

  render () {
    const { data } = this.props
    const { opened, content } = data

    return (
      <AnimationWrapper opened={opened} ref={(node) => { this.node = node }}>
        <Header>
          <Text size='20px' weight={300}>
            {content === 'faq' && <FormattedMessage id='layouts.wallet.trayright.faq' defaultMessage='Frequently Asked Questions' />}
            {content === 'whatsnew' && <FormattedMessage id='layouts.wallet.trayright.whatsnew' defaultMessage='What’s New' />}
          </Text>
          <Icon size='20px' name='close' cursor onClick={this.handleClose} />
        </Header>
        <Content>
          {content === 'faq' && <Faq />}
          {content === 'whatsnew' && <WhatsNew />}
        </Content>
      </AnimationWrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TrayRightContainer)
