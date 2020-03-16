/*
 *  Copyright (C) 2020 Tusooa Zhu
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import sdk from 'matrix-js-sdk'
import './styles.scss'
import ch from '../../helpers/client'
import { i18n, i18nc, i18nn, format } from '../../helpers/i18n'

function Action(props)
{
  return <span className='nw-timeline-message--event-action'>
           {props.children}
         </span>
}

const debug = console.log

// returns an object consisting of {action, body}
const contentHandlers = {
  'm.text': content => ({ body: content.body }),
  'm.bad.encrypted': content => ({
    action: i18n('%{user} sent a message that cannot be decrypted:'),
    body: content.body,
  }),
  'm.image': content =>
    ({action:
      i18n('%{user} sent an image named "%{filename}":',
           { filename:
             <a href={ch.get().mxcUrlToHttp(content.url)}
                target='_blank' rel="noopener noreferrer">
               { content.body }
             </a>}),
      body:
      <img className='nw-timeline-message--event-image-preview'
           src={ ch.get().mxcUrlToHttp(content.url) }
           alt={ content.body } />
     }),
  'm.file': content => ({
    action:
    i18n('%{user} sent a file named "%{filename}".',
         { filename:
           <a href={ch.get().mxcUrlToHttp(content.url)}
              target='_blank' rel="noopener noreferrer">
             { content.body }
           </a>}),
  }),
}

const eventHandlers = {
  'm.room.message': msg => {
    const type = msg.getContent().msgtype
    const handler = contentHandlers[type]
    return handler ? handler(msg.getContent())
      : { action: i18n('%{user} sent a message of unsupported content type.') }
  },
  'm.call.hangup': msg => ({
    action: i18n('%{user} ended the call (reason: %{reason}).',
                 { reason: msg.getContent().reason })
  }),
  'm.call.invite': msg => ({
    action: i18n('%{user} started a call.')
  }),

  'm.room.create': msg => ({ action: i18n('%{user} created the room.') }),
  'm.room.member': msg => {
    let action
    switch (msg.getContent().membership) {
    case 'join':
      action = i18n('%{user} joined the room.')
      break;

    case 'invite':
      action = i18n('%{user} invited %{invitedPerson} to join the room.',
                    { invitedPerson: msg.getStateKey() })
    }
    return { action }
  },
  'm.room.power_levels': msg => ({
    action: i18n('%{user} set the power levels of the room.')
  }),
  'm.room.join_rules': msg => ({
    action: i18n('%{user} set the join rules of this room to "%{joinRule}".',
                 { joinRule: msg.getContent().join_rule })
  }),
  'm.room.history_visibility': msg => ({
    action: i18n('%{user} set the history visibility of this room to "%{visibility}".', { visibility: msg.getContent().history_visibility })
  }),
  'm.room.guest_access': msg => ({
    action: i18n('%{user} set the guest access rule of this room to "%{guestAccess}".', { guestAccess: msg.getContent().guest_access })
  })
}

const handleEvent = msg => {
  const handler = eventHandlers[msg.getType()]

  return handler
    ? handler(msg)
    : { action: i18n('%{user} sent an event of unsupported event type.') }
}

const ignoredEvents = ['m.call.candidates']

class Message extends React.Component
{
  /**
   * @param props: { msg: MatrixEvent }
   */
  constructor(props)
  {
    super(props)
  }

  render()
  {
    const msg = this.props.msg
    const matrix = ch.get()
    const sender = msg.getSender()
    const isMe = sender === matrix.getUserId()
    if (ignoredEvents.includes(msg.getType())) {
      return []
    }
    const { action, body } = handleEvent(msg)

    const user =
          <span className={ 'nw-timeline-message--sender-name'
                            + (isMe
                               ? ' nw-timeline-message--sender-name-me'
                               : '')}>
            { sender }
          </span>;

    return (
      <div className='nw-timeline-message'>
        <div className='nw-timeline-message--sender'>
          { msg.isEncrypted() &&
            <div className='nw-timeline-message--status'>
              { i18n('🔒', {}, format.FINAL) }
            </div> }
          { action
            ? <Action>{ format(action, { user }, format.FINAL) }</Action>
            // Followed by a message a user sent, e.g. tusooa: This is a message
            : i18n('%{user}:', { user }, format.FINAL) }
        </div>
        <div className='nw-timeline-message--event'>
          { body }
        </div>
        <div className='nw-timeline-message--status'>
          { msg.isSending() ? i18n('[sending]', {}, format.FINAL) : '' }
        </div>
      </div>
    )
  }
}

export default Message
