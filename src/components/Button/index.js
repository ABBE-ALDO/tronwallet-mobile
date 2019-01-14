import React, { Component } from 'react'
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'
import styled from 'styled-components'
import { ButtonSize } from './../DesignSystem'

const Touchable = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback
})

const BtnWrapper = styled(Touchable)`
  height: ${props => props.height};
  border: 1px solid #000;
  flex-direction: row;
`

class Button extends Component {
  getButtonSize = () => {
    switch (this.props) {
      case this.props.small:
        return ButtonSize.small

      case this.props.medium:
        return ButtonSize.medium

      case this.props.large:
        return ButtonSize.large

      case this.props.full:
        return '100%'

      default:
        return ButtonSize.medium
    }
  }

  render () {
    const { children } = this.props
    return (
      <BtnWrapper height={this.getButtonSize()} >
        {children}
      </BtnWrapper>
    )
  }
}

export default Button
