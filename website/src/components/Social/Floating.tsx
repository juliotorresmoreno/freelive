import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import config from '../../config'
import withData from '../../hoc/withData'
import useSearch from '../../hooks/useSearch'
import { IChat } from '../../models/chat'
import { useAdd } from '../../services/chats'
import Input from '../Input'

const ContactsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--spacing-v1);
`

const Contact = styled.div`
  height: auto;
  line-height: initial;
  cursor: pointer;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const InputSearch = Input

type _FloatingProps = {
  payload: IChat[]
}

const _Floating: React.FC<_FloatingProps> = ({ payload }) => {
  const url = '/users'
  const [ignore, setIgnore] = useState<any>({})
  const [search, setSearch, result] = useSearch(url)
  const navigate = useNavigate()
  const { add } = useAdd()

  const users =
    result.length > 0
      ? result.map((el) => ({
          id: el.id.toString(),
          name: (
            <>
              <span className="material-symbols-outlined">person_add</span>
              &nbsp;
              {el.getFullName()}
            </>
          ),
          handler: () => {
            add({ user_id: el.id })
              .then(async (chat) => {
                setIgnore({
                  ...ignore,
                  [chat.id]: true,
                })
                navigate('/chats/' + chat.code)
              })
              .catch((err: Error) => {})
          },
        }))
      : payload.map((el) => ({
          id: el.code,
          name: (
            <>
              <span className="material-symbols-outlined">person</span>
              &nbsp;
              {el.name}
            </>
          ),
          handler: () => {
            navigate('/chats/' + el.code)
          },
        }))

  return (
    <>
      <InputSearch type="text" value={search} onChange={setSearch} />
      <ContactsContainer>
        {users.map((contact) => {
          if (ignore[contact.id]) return null
          return (
            <Contact key={contact.id} onClick={contact.handler}>
              {contact.name}
            </Contact>
          )
        })}
      </ContactsContainer>
    </>
  )
}

const url = config.baseUrl + '/chats'
const Floating = withData(_Floating, url)

export default Floating
