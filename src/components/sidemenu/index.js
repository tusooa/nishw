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
import './styles.scss'
import ch from '../../helpers/client'

class SideMenu extends React.Component
{
  /**
   * @param props: {position='left'|'right'}
   */
  constructor(props)
  {
    super(props)
    this.state = {
      showing: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle()
  {
    this.setState({ showing: !this.state.showing })
  }

  render()
  {
    const { position, className, title } = this.props
    const fullClassName = `nw-sidemenu nw-sidemenu--${position} nw-sidemenu-${ this.state.showing ? 'on' : 'off' }` +
          (className ? ' ' + className : '')
    return <div className={ fullClassName }>
             <span className='nw-sidemenu--toggle'
                   onMouseUp={ this.toggle }>
               { title }
             </span>
             { this.state.showing && this.props.children }
           </div>
  }

}

class MenuItem extends React.Component
{
  render()
  {
    const { onClick, className, children } = this.props
    const fullClassName = 'nw-sidemenu--item' +
          (className ? ' ' + className : '')

    return <div onMouseUp={ onClick }
                className={ fullClassName }>
             { children }
           </div>
  }
}

SideMenu.Item = MenuItem

export default SideMenu
