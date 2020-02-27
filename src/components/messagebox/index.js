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

class MessageBox extends React.Component
{
  /// @param: props: { room: Room }
  constructor(props)
  {
    super(props)
  }

  render()
  {
    if (!this.props.room) { return [] }
    
    return (
      <div>
        <div>{ this.props.room.name }</div>
        <ul>
          { this.props.room.timeline.map(msg => (
            <li key={ msg.getId() }>{msg.getSender()}: { msg.event.content.body }</li>
          ))
          }
        </ul>
      </div>);
  }
}

export default MessageBox
