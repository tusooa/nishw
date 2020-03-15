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
  'm.image': content =>
    ({action:
      ['sent an image ',
       <a href={ch.get().mxcUrlToHttp(content.url)}
          target='_blank'>
         "{ content.body }"
       </a>],
      body:
      <img className='nw-timeline-message--event-image-preview'
           src={ ch.get().mxcUrlToHttp(content.url) }
           alt={ content.body } />
     }),
}

const eventHandlers = {
  'm.room.message': msg => {
    const type = msg.getContent().msgtype
    const handler = contentHandlers[type]
    return handler ? handler(msg.getContent())
      : { action: 'sent a message of unsupported content type' }
  },
  'm.call.hangup': msg => ({
    action: `ended the call (${msg.getContent().reason})`
  }),
  'm.call.invite': msg => ({
    action: 'started a call'
  }),
}

const handleEvent = msg => {
  const handler = eventHandlers[msg.getType()]

  return handler
    ? handler(msg)
    : { action: 'sent an event of unsupported event type' }
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

    return (
      <div className='nw-timeline-message'>
        <div className='nw-timeline-message--sender'>
          <span className={ 'nw-timeline-message--sender-name'
                            + (isMe
                               ? ' nw-timeline-message--sender-name-me'
                               : '')}>
            { sender }
          </span>{ action ? [' ',<Action>{action}</Action>] : ':' }
        </div>
        <div className='nw-timeline--event'>
          { body }
        </div>
        <div className='nw-timeline--status'>
          { msg.isSending() ? '[sending]' : '' }
        </div>
      </div>
    )
  }
}

export default Message
