import React, { PureComponent } from 'react'
import { func } from 'prop-types'

import { View } from '../../Utils'
import AddressInput from '../../Import/AddressInput'
import { Colors } from '../../DesignSystem'

class WatchAccountOption extends PureComponent {
  static propTypes = {
    onChangeData: func.isRequired
  }

  state = {
    address: '',
    error: null,
    valid: false
  }

  _changeAddress = (address, error) => {
    const valid = !error && !!address

    this.setState({ address, error, valid })
    this.props.onChangeData({ address, valid })
  }

  render () {
    return (
      <View marginTop={15}>
        <AddressInput
          labelWrapperColor={Colors.dusk}
          onChangeText={this._changeAddress}
        />
      </View>
    )
  }
}

export default WatchAccountOption
