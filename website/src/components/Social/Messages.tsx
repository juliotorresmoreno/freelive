import React, { useContext, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import SocialContext from './SocialContext'
import { useAdd } from '../../services/messages'
import { useAppSelector } from '../../store/hooks'
import Emoji from '../Emoji'
import _Input from '../Input'
import Message from './Message'
import Anchor from '../Anchor'

const Container = styled.div`
  background-color: white;
  display: flex;
  flex: 1;
  flex-direction: column;
`

const Content = styled.div`
  overflow-y: scroll;
  height: calc(100vh - 163px);
`

const InputContainer = styled.div`
  background-color: white;
  display: flex;
  height: calc(var(--spacing-v1) * 3.5);
  gap: var(--spacing-v1);
`

const Input = styled(_Input)`
  flex: 1;
  height: calc(var(--spacing-v1) * 3.5);
`

const AttachmentContainer = styled.div`
  margin-bottom: var(--spacing-v1);
`

const Attachment = styled.div`
  display: inline-block;
  margin-right: var(--spacing-v1);
`

const SendButton = styled(Anchor)`
  line-height: calc(var(--spacing-v1) * 3.5);
`

const Messages = () => {
  const { attachments, setAttachments } = useContext(SocialContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoading, error, add } = useAdd()
  const id = useParams().id as string
  const notifications = useAppSelector((state) => state.messages.notifications)

  const send = () => {
    const current = inputRef.current
    if (!current) return

    const message = current.value

    add({
      code: id as string,
      message,
      attachments: attachments.map((file) => ({
        name: file.name,
        body: file.body ?? '',
      })),
    })
    current.value = ''
    setAttachments([])
  }

  const onKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (evt.key === 'Enter') return send()
  }

  useEffect(() => {
    const current = contentRef.current
    const clientHeight = current?.clientHeight ?? 0
    const scrollHeight = current?.scrollHeight ?? 0
    const top = scrollHeight - clientHeight
    current?.scrollTo({ top })
  })

  const messages = notifications[id]?.messages ?? []

  const onEmojiSelect = (emoji: string) => {
    const current = inputRef.current
    if (!current) return

    const message = current.value
    const selectionStart = current.selectionStart ?? 0
    const selectionEnd = current.selectionEnd ?? 0

    current.value =
      message.substring(0, selectionStart) +
      emoji +
      message.substring(selectionEnd)

    current.setSelectionRange(selectionStart + 2, selectionStart + 2)
    current.focus()
  }

  return (
    <Container>
      <Content ref={contentRef}>
        {messages.map((message, key) => (
          <Message key={'message-' + key} data={message} />
        ))}
        <AttachmentContainer>
          {attachments.map((x, key) => (
            <Anchor
              key={'attachment-' + key}
              href={x.url}
              download={x.name}
              onClick={() => {}}
            >
              <Attachment>{x.name}</Attachment>
            </Anchor>
          ))}
        </AttachmentContainer>
      </Content>
      <InputContainer>
        <Emoji onSelect={onEmojiSelect} />
        <Input ref={inputRef} disabled={isLoading} onKeyUp={onKeyUp} />
        <SendButton onClick={() => send()}>
          <span className="material-symbols-outlined">send</span>
        </SendButton>
      </InputContainer>
    </Container>
  )
}

export default Messages
