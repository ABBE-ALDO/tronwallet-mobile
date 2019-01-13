import qs from 'qs'
import React, { Component } from 'react'
import { RefreshControl, ScrollView, Linking, Alert } from 'react-native'
import { Answers } from 'react-native-fabric'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MixPanel from 'react-native-mixpanel'

import NavigationHeader from '../../components/Navigation/Header'
import * as Utils from '../../components/Utils'
import WalletBalances from './WalletBalances'
import BalanceNavigation from './BalanceNavigation'
import AccountsCarousel from './AccountsCarousel'
import { ButtonHeader, Badge } from './../../components/Navigation/elements'

import tl from '../../utils/i18n'
import withContext from '../../utils/hocs/withContext'
import { logSentry } from '../../utils/sentryUtils'
import onBackgroundHandler from '../../utils/onBackgroundHandler'
import AddAccountModal from '../../components/AddAccounts/AddAccountModal'
import AddAccountButton from '../../components/AddAccounts/AddAccountButton'
import { Colors } from './../../components/DesignSystem'

export class BalanceScene extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false,
    creatingNewAccount: false,
    error: null,
    balances: [],
    currency: null,
    accountModalVisible: false,
    newAccountName: ''
  }

  componentDidMount () {
    Answers.logContentView('Tab', 'Balance')
    this._navListener = this.props.navigation.addListener('didFocus', this._loadData)
    this.appStateListener = onBackgroundHandler(this._onAppStateChange)

    Linking
      .getInitialURL()
      .then(url => this.handleOpenURL(url))
      .catch(err => console.error('An error occurred 2', err))

    Linking.addEventListener('url', ({ url }) => this.handleOpenURL(url, true))
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleOpenURL)
    this._navListener.remove()
    this.appStateListener.remove()
  }

  handleOpenURL = (url, fromBackground) => {
    if (url) {
      const route = url.replace(/.*?:\/\//g, '') // eslint-disable-line no-useless-escape.
      const querystring = route.match(/\/([^/]+)\/?$/)[1] // eslint-disable-line no-useless-escape.
      const routeName = route.split('/')[0]

      const data = qs.parse(querystring)

      const isValidData = data && data.amount && data.address && data.command

      if (routeName === 'contract' && isValidData) {
        if (fromBackground) {
          return this.props.navigation.navigate('Pin', {
            testInput: pin => pin === this.props.context.pin,
            onSuccess: () => this.props.navigation.navigate('ContractPreview', { ...data })
          })
        }
        return this.props.navigation.navigate('ContractPreview', { ...data })
      }

      return Alert.alert('Invalid smart contract')
    }
  }

  _loadData = async () => {
    try {
      await this.props.context.loadUserData()
      const currentAccount = this.props.context.getCurrentAccount()
      if (currentAccount) {
        MixPanel.trackWithProperties('Balance load', {
          name: currentAccount.name,
          address: currentAccount.address,
          balance: currentAccount.balance || 0
        })
      }
    } catch (e) {
      this.setState({ error: tl.t('balance.error.loadingData') })
      logSentry(e, 'Balance - LoadData')
    }
  }

  _createAccountPressed = () => {
    const { userSecrets } = this.props.context
    const newAccountName = `Account ${userSecrets.length}`

    this.setState({
      accountModalVisible: true,
      newAccountName,
      accountNameError: null
    })
  }

  _onCreatedNewAccount = async () => {
    this.setState({ creatingNewAccount: true })

    await this.props.context.loadUserData()
    this.carousel.innerComponent._snapToNewAccount()

    this.setState({ creatingNewAccount: false })
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this._loadData()
    this.setState({ refreshing: false })
  }

  _onAppStateChange = nextAppState => {
    if (nextAppState.match(/background/)) {
      // Closing all modals
      this.setState({ accountModalVisible: false })
      if (this.carousel.innerComponent.ActionSheet && this.carousel.innerComponent.ActionSheet.hide) {
        this.carousel.innerComponent.ActionSheet.hide()
      }
    }
  }

  _leftButtonHeader = () => {
    const { hasUnreadNotification } = this.props.context
    return (
      <ButtonHeader onPress={() => this.props.navigation.navigate('Notifications')}>
        <Badge value={hasUnreadNotification}>
          <Ionicons
            name='ios-notifications-outline'
            size={28}
            color={Colors.primaryText}
          />
        </Badge>
      </ButtonHeader>
    )
  }

  _rightButtonHeader = () => {
    const { secretMode } = this.props.context
    const { creatingNewAccount } = this.state

    return (
      <AddAccountButton
        onPress={this._createAccountPressed}
        loading={creatingNewAccount}
        secretMode={secretMode}
      />
    )
  }

  _gotoAddExistentAccount = () => {
    this.setState({ accountModalVisible: false })
    this.props.navigation.navigate('AddAccountsScene')
  }

  render () {
    const {
      refreshing,
      accountModalVisible
    } = this.state

    const {
      pin,
      oneSignalId,
      userSecrets
    } = this.props.context

    const rightButton = this._rightButtonHeader()

    return (
      <Utils.SafeAreaView>
        <NavigationHeader
          leftButton={this._leftButtonHeader()}
          title={tl.t('balance.title')}
          rightButton={rightButton}
        />
        <Utils.Container justify='flex-start' align='stretch'>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <AccountsCarousel ref={input => (this.carousel = input)} />
            <Utils.VerticalSpacer size='medium' />
            <Utils.Content paddingTop={0}>
              <BalanceNavigation />
              <WalletBalances />
            </Utils.Content>
          </ScrollView>
        </Utils.Container>
        <AddAccountModal
          pin={pin}
          oneSignalId={oneSignalId}
          totalAccounts={userSecrets.length}
          visible={accountModalVisible}
          onCreated={this._onCreatedNewAccount}
          closeModal={() => this.setState({ accountModalVisible: false })}
          gotoAddExistentAccount={this._gotoAddExistentAccount}
        />
      </Utils.SafeAreaView>
    )
  }
}

export default withContext(BalanceScene)
