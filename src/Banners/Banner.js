import React from 'react'
import styled from 'styled-components'
import { Icon } from '../Icons'
import { Text } from '../Text'

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }

  // TODO: Update color strings to use new naming style
  textColor() {
    switch (this.props.type) {
      case "success": return "jade";
      case "warning": return "mahogany";
      default: return "iris";
    }
  }

  textTransform() {
    return this.props.type === "warning" ? true : false;
  }

  // -- Helper Functions -- //

  getRGBFor(type) {
    switch (type) {
      case "success": return "0, 167, 111";
      case "warning": return "202, 58, 60";
      default: return "16, 173, 228";
    }
  }

  // TODO: Update icons
  getIconFor(type) {
    switch (type) {
      case "alert": return <Icon name="bell" color="iris" size="12px" />;
      case "warning": return <Icon name="alert" color="mahogany" size="12px" />;
      case "success": return <Icon name="success" color="jade" size="12px" />;
      default: return null;
    }
  }

  render() {
    const Icon = this.getIconFor(this.props.type);
    const Message = this.props.text;
    const RGBVal = this.getRGBFor(this.props.type);
    const Container = styled.div`
      background: rgba(${RGBVal}, .1);
      border: 1px solid rgba(${RGBVal}, .2);
      border-radius: 4px;
      margin-top: 10px;
      padding: 5px 10px;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      & div > span { padding-right: 8px; }
    `

    return(
      <Container>
        <Text color={this.textColor()} size="12px" weight={400} uppercase={this.textTransform()}>
          {Icon}{Message}
        </Text>
      </Container>
    );
  }
}

export default Banner
