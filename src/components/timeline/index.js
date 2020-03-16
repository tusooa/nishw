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
import Message from './message'
import { i18n } from '../../helpers/i18n'
const debug = console.log


class Timeline extends React.Component
{
  /// @param props: {room: Room,
  ///                timelineSet: timelineSet}
  constructor(props)
  {
    super(props)
    this.state = { timeline: [] }

    this.timelineWindow = new sdk.TimelineWindow(
      ch.get(), this.props.timelineSet)

    this.reloadEvents = this.reloadEvents.bind(this)
    this.onRoomTimeline = this.onRoomTimeline.bind(this)
    this.paginateBack = this.paginateBack.bind(this)
    this.paginateForward = this.paginateForward.bind(this)
    this.paginate = this.paginate.bind(this)
    this.notifyUpdate = this.notifyUpdate.bind(this)
    this.updateTimeline = this.updateTimeline.bind(this)

    this.mounted = false
  }

  componentDidMount()
  {
    this.mounted = true
    ch.get().on('Room.timeline', this.onRoomTimeline)
    this.timelineWindow.load()
    this.reloadEvents()
  }

  componentWillUnmount()
  {
    this.mounted = false
    ch.get().removeListener('Room.timeline', this.onRoomTimeline)
  }

  onRoomTimeline(event, room)
  {
    if (room !== this.props.room) {
      debug('not current room')
      return
    }
    if (!this.mounted) {
      debug('not mounted')
      return
    }
    this.updateTimeline()
  }

  paginateBack()
  {
    return this.paginate(sdk.EventTimeline.BACKWARDS)
  }

  paginateForward()
  {
    return this.paginate(sdk.EventTimeline.FORWARDS)
  }

  paginate(direction)
  {
    return this.timelineWindow.paginate(direction, 10)
  }

  reloadEvents()
  {
    debug('reloading events')
    const events = this.timelineWindow.getEvents()

    const timeline =
          this.timelineWindow.canPaginate(sdk.EventTimeline.FORWARDS)
          ? events
          : events.concat(this.props.timelineSet.getPendingEvents())
    debug('Timeline now:', timeline)

    this.setState({ timeline })
  }

  updateTimeline()
  {
    this.paginateForward()
      .then(this.reloadEvents)
  }

  async notifyUpdate()
  {
    this.updateTimeline()
  }

  render()
  {
    const { timeline } = this.state
    const matrix = ch.get()

    return (
      <div className='nw-timeline'>
        <button
          onClick={ () => this.paginateBack().then(this.reloadEvents) }>
          { i18n('Back') }
        </button>
        <div className='nw-timeline--scrollview'>
          { timeline.map(msg => <Message key={msg.getId()} msg={msg} />) }
        </div>
      </div>
    )
  }
}

export default Timeline
