import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../components/Modal'
import {
  ContactsModalWrapper,
  ContactsModalCard,
  Divider,
  Action,
  ActionText,
  Title
} from './elements'

const ContactsModal = ({
  visible,
  closeModal,
  animationType,
  onPressEdit,
  onPressSend
}) => (
  <Modal
    modalOpened={visible}
    closeModal={closeModal}
    animationType={animationType}
    transparent
  >
    <ContactsModalWrapper onPress={closeModal}>
      <ContactsModalCard>
        <Title>Would you like to</Title>
        <Action onPress={onPressEdit}>
          <ActionText>EDIT</ActionText>
        </Action>
        <Divider />
        <Action onPress={onPressSend}>
          <ActionText>SEND</ActionText>
        </Action>
      </ContactsModalCard>
    </ContactsModalWrapper>
  </Modal>
)

ContactsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPressEdit: PropTypes.func.isRequired,
  onPressSend: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  animationType: PropTypes.string
}

export default ContactsModal
