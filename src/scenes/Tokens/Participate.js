import React, { Component } from 'react'
import { ActivityIndicator, SafeAreaView, Linking } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import qs from 'qs'
import Feather from 'react-native-vector-icons/Feather'
import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Client, { ONE_TRX } from '../../services/client'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'

class ParticipateScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Participate</Utils.Title>
            </Utils.TitleWrapper>
            <Utils.LoadButtonWrapper>
              <Utils.LoadButton onPress={() => navigation.goBack()}>
                <Feather name='x' color='white' size={32} />
              </Utils.LoadButton>
            </Utils.LoadButtonWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    value: '',
    loading: false,
    error: null,
  }

  _confirm = async () => {
    const { navigation } = this.props;
    try {
      this.setState({ loading: true });

      if (navigation.state.params.trxBalance < this.state.value) {
        alert('Insufficient TRX balance');
        throw new Error('Insufficient TRX balance');
      }
      const pk = await Client.getPublicKey()
      const response = await axios.post(
        'https://tronnotifier-dev.now.sh/v1/wallet/participate',
        {
          from: pk,
          issuer: navigation.state.params.token.ownerAddress,
          token: navigation.state.params.token.name,
          amount: Number(this.state.value)
        }
      )
      const dataToSend = qs.stringify({
        txDetails: {
          from: pk,
          issuer: navigation.state.params.token.ownerAddress,
          token: navigation.state.params.token.name,
          amount: Number(this.state.value),
          Type: 'PARTICIPATE'
        },
        pk: pk,
        from: 'mobile',
        action: 'transaction',
        URL: MakeTronMobileURL('transaction'),
        data: response.data.transaction
      })

      this.openDeepLink(dataToSend)
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ loading: false })
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${TronVaultURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  formatPercentage = (percentage) => numeral(percentage).format('0.[00]') + '%'

  formatCurrency = (value) => numeral(value).format('0,0[.]00')

  formatDate = (date) => moment(date).format('YYYY-MM-DD h:mm:ss')

  renderConfirmButtom = () => {
    if (this.state.loading) return <ActivityIndicator color={'#ffffff'} />

    return (
      <ButtonGradient onPress={this._confirm} text='Confirm' size='xsmall' />
    )
  }

  render() {
    const token = this.props.navigation.getParam('token')
    return (
      <KeyboardAwareScrollView>
        <Utils.Container>
          <Utils.Content>
            <Utils.View >
              <Utils.Content justify='center'>

                <Utils.Row justify='space-between'>
                  <Utils.Text size='medium'>{token.name}</Utils.Text>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />
                <Utils.Text size='xsmall' secondary>
                  AMOUNT
                </Utils.Text>
                <Utils.FormInput
                  keyboardType='numeric'
                  placeholder='0'
                  value={this.state.value}
                  onChangeText={value => this.setState({ value })}
                  underlineColorAndroid='transparent'
                  returnKeyType={'send'}
                />
                <Utils.Text>
                  {Number(this.state.value) * token.price / ONE_TRX} TRX
                </Utils.Text>
                <Utils.VerticalSpacer />
                {this.renderConfirmButtom()}
              </Utils.Content>

              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>PRICE</Utils.Text>
                  <Utils.Text>{this.formatCurrency(token.price)}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>FROZEN</Utils.Text>
                  <Utils.Text>{token.frozen[0] ? token.frozen[0].amount : 0}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>PERCENTAGE</Utils.Text>
                  <Utils.Text>{this.formatPercentage(token.percentage)}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>ISSUED</Utils.Text>
                  <Utils.Text>{token.issued}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>TOTALSUPPLY</Utils.Text>
                  <Utils.Text>{token.totalSupply}</Utils.Text>
                </Utils.View>
              </Utils.Row>

              <Utils.VerticalSpacer size='medium' />

              <Utils.Text size='xsmall' secondary>DESCRIPTION</Utils.Text>
              <Utils.Text size='xsmall'>{token.description}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Text size='xsmall' secondary>TRANSACTION</Utils.Text>
              <Utils.Text size='xsmall'>{token.transaction}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Text size='xsmall' secondary>OWNER ADDRESS</Utils.Text>
              <Utils.Text size='xsmall'>{token.ownerAddress}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>TRXNUM</Utils.Text>
                  <Utils.Text>{token.trxNum / ONE_TRX}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>NUM</Utils.Text>
                  <Utils.Text>{token.num}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>BLOCK</Utils.Text>
                  <Utils.Text>{token.block}</Utils.Text>
                </Utils.View>

              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Row justify='space-between'>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>STARTTIME</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.startTime)}</Utils.Text>
                </Utils.View>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>ENDTIME</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.endTime)}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Row>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>DATECREATED</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.dateCreated)}</Utils.Text>
                </Utils.View>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>VOTESCORE</Utils.Text>
                  <Utils.Text>{token.voteScore}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />

              <Utils.Text size='xsmall' secondary>URL</Utils.Text>
              <Utils.Text>{token.url}</Utils.Text>

              <Utils.VerticalSpacer size='medium' />
            </Utils.View>
          </Utils.Content>
        </Utils.Container>
      </KeyboardAwareScrollView >
    )
  }
}

export default ParticipateScene
