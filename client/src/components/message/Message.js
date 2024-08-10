import React from 'react'
import styled from 'styled-components'
import { useMessages } from '../../context/MessagesContext'
import CollapsibleItem from '../dashboard/CollapsibleItem'
import Button from '../buttons/Button'
import Trash from '../../icons/Trash'

export default function Message({ message, isOpen, onToggle }) {
	const { markAsUnread, deleteMessage } = useMessages()

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date
			.toLocaleDateString('en-GB', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			})
			.split('/')
			.reverse()
			.join('-')
	}

  const handleReplyClick = () => {}

  const handleMarkUnread = () => {
    markAsUnread(message.id)
    onToggle()
  }
  

	return (
		<MessageContainer>
			<StyledMessage
        $isActive={isOpen}
      >
        <CollapsibleItem
          message={true}
          onClick={onToggle}
          isActive={isOpen}
          text={
            <p>
              {formatDate(message.createdAt)} - From{' '}
              <span>{message.sender.username}</span>
            </p>
          }
          isRead={message.isRead}
        />
      </StyledMessage>
        {isOpen && (
          <MessageContent>
            <MessageBody>
              <p>{message.message}</p>
            </MessageBody>
            <MessageControls>
              <div>
                <Button type="message" text="Reply" />
                <Button type="message" text="Mark as unread" onClick={handleMarkUnread}/>
              </div>
              <Trash
                type="message"
                text="Delete"
                onClick={() => deleteMessage(message.id)}
              />
            </MessageControls>
          </MessageContent>
        )}
		</MessageContainer>
	)
}

const MessageContainer = styled.div`
  transition: var(--fast);
	p {
		font-family: 'Roboto', sans-serif;
		font-size: 1.4rem;
	}
  
`

const StyledMessage = styled.div`
  padding: var(--sm) var(--lg);
  background-color: ${({ $isActive }) =>
    $isActive ? 'var(--ltGreenHover)' : 'none'};
  &:hover {
    background-color: var(--ltGreenHover);
  }
`

const MessageContent = styled.div`
	border: 1px solid var(--ltGreen);
	display: flex;
  flex-direction: column;
	justify-content: space-between;
`

const MessageBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--sm);
  padding: var(--lg);
  background-color: var(--white);
	p {
		font-size: 1.4rem;
		white-space: pre-wrap;
		word-break: break-word;
	}
	span {
		font-weight: bold;
		color: var(--dkGreen);
	}
`

const MessageControls = styled.div`
  background-color: var(--dkGreenA);
	display: flex;
	justify-content: space-between;
  align-items: center;
	gap: var(--sm);
  padding: 0 var(--lg);
  div {
    display: flex;
    gap: var(--lg);
  }
`
