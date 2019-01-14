import React from 'react'
import { ActivityIndicator } from 'react-native'
import { string, func, bool } from 'prop-types'

import { Colors } from '../DesignSystem'
import ButtonGradient from '../ButtonGradient'

const LoadingButtonGradient = ({ text, loading, onPress, disabled }) =>
  loading
    ? (<ActivityIndicator size='small' color={Colors.primaryText} />)
    : (
      <ButtonGradient
        font='bold'
        text={text}
        onPress={onPress}
        disabled={disabled}
      />
    )

LoadingButtonGradient.propTypes = {
  loading: bool,
  text: string.isRequired,
  onPress: func.isRequired,
  disabled: bool
}

LoadingButtonGradient.defaultProps = {
  loading: false,
  disabled: false
}

export default LoadingButtonGradient
