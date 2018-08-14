import React, { Component } from 'react'

import AddressBook from '../../components/AddressBook'
import FloatingButton from '../../components/FloatingButton'

import { getContactsFromStore } from '../../utils/contactUtils'

export default class Contacts extends Component {
  state = {
    contacts: null,
    refreshing: false
  }

  async componentDidMount () {
    await this._loadContacts()

    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      async () => {
        await this._loadContacts()
      }
    )
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove()
  }

  _loadContacts = async () => {
    try {
      const contacts = await getContactsFromStore()
      this.setState({
        contacts,
        error: null
      })
    } catch (e) {
      this.setState({
        error: 'There was a problem loading the contacts. Please try again.'
      })
    }
  }

  // _getVoteListFromStore = async (store = null) => {
  //   let voteStore
  //   if (store) voteStore = store
  //   else voteStore = await getCandidateStore()
  //   return voteStore
  //     .objects('Candidate')
  //     .sorted([['votes', true], ['rank', false]])
  //     .slice(
  //       this.state.offset,
  //       clamp(
  //         this.state.offset + LIST_STEP_SIZE,
  //         voteStore.objects('Candidate').length
  //       )
  //     )
  //     .map(item => Object.assign({}, item))
  // }

  _onAddPress = () => {
    const { navigation } = this.props

    navigation.navigate('AddContact')
  }

  render () {
    const { contacts } = this.state
    const { navigation } = this.props

    return (
      <AddressBook
        items={contacts}
        navigation={navigation}
        reloadData={this._loadContacts}
      >
        <FloatingButton text='ADD CONTACT' onPress={this._onAddPress} />
      </AddressBook>
    )
  }
}
