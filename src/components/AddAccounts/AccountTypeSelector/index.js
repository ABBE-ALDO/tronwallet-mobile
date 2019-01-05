import React, { Component } from 'react'
import { TabViewAnimated } from 'react-native-tab-view'

// Design
import { View } from '../../Utils'

// Utils
import tl from '../../../utils/i18n'
import {
  DefaultAccountOption,
  HeaderTab
} from './tabs'
import PrivateKeyAccountOption from './PrivateKeyAccountOption'
import WatchAccountOption from './WatchAccountOption'

export class AccountTypeSelector extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    index: 0,
    routes: [
      { key: 'default', title: tl.t('import.header.default') },
      { key: 'privateKey', title: tl.t('import.header.privateKey') },
      { key: 'watch', title: tl.t('import.header.watch') }
    ]
  }

  _handleIndexChange = index => this.setState({ index })

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'privateKey':
        return (<PrivateKeyAccountOption />)
      case 'watch':
        return (<WatchAccountOption />)
      default:
        return (<DefaultAccountOption />)
    }
  }

  render () {
    return (
      <View style={{ height: 270 }}>
        <TabViewAnimated
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={HeaderTab}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    )
  }
}

export default AccountTypeSelector
