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

const debug = console.log

const splitPattern = /(%%|%\{\s*[A-Za-z0-9-]+\s*\})/
const fmtPattern = /^%\{\s*([A-Za-z0-9-]+)\s*\}$/
const literalFormat = '%%'

class FormatSpecifier
{
  constructor(key)
  {
    this.key = key
    this.formatted = false
    this.value = undefined
  }

  formatWith(value)
  {
    this.value = value
    this.formatted = true
    return this
  }
}

const splitString = fmt => (
  fmt.split(splitPattern)
  // convert format commands to objects
    .map(s => {
      const match = s.match(fmtPattern)
      if (match) {
        return new FormatSpecifier(match[1])
      } else {
        return s
      }
    })
  // now, every item in the array is a string or object
  // concat adjacent strings
    .reduce((a, s) =>
            ((typeof(a[a.length - 1]) === 'string'
              && typeof(s) === 'string')
             ? a.slice(0, a.length - 1)
             .concat(a[a.length - 1] + s)
             : a.concat(s)), [])
)

/**
 * @param fmt: Array of (FormatSpecifier|String)
 * @param parameters: Object
 * @param isFinal: (optional) If set to format.FINAL,
 *                 get rid of all FormatSpecifiers
 */
const format = (fmt, parameters, isFinal) => {
  const arr = (
    // replace objects with parameters
    fmt.map(s => (s instanceof FormatSpecifier
                  && ! s.formatted)
           // if the required parameter does not exist,
           // leave it as it is
            ? (s.key in parameters ? s.formatWith(parameters[s.key]) : s)
            : s))
  // return the result list as-is, so we can incorporate it
  // into JSX code

  const res = isFinal
  // if fully formatted we can remove FormatSpecifier
        ? arr.map(s => (s instanceof FormatSpecifier ? s.value : s))
        : arr

  return res
}

format.FINAL = true

class I18nHelper
{
  constructor()
  {
    this.i18n = this.i18n.bind(this)
  }

  translate(str)
  {
    return str // TODO
  }

  ntranslate(strSg, strPl, n)
  {
    return n > 1 ? strPl : strSg // TODO
  }

  ctranslate(str)
  {
    return str // TODO
  }

  /**
   * @param msg: String    the format string
   * @param parameters: Object  the object containing the keys in msg
   * @param isFinal   if equal to format.FINAL,
   *                  produce the final result and disallow further formats
   */
  i18n(msg, parameters, isFinal)
  {
    const t = this.translate(msg)
    return format(splitString(t), parameters || {}, isFinal)
  }

  i18nn(msgSg, msgPl, n, parameters, isFinal)
  {
    const t = this.ntranslate(msgSg, msgPl, n)
    return format(splitString(t), parameters || {}, isFinal)
  }

  i18nc(ctx, msg, parameters, isFinal)
  {
    const t = this.ctranslate(ctx, msg)
    return format(splitString(t), parameters || {}, isFinal)
  }
}

if (!global.nishwI18nHelper) {
  global.nishwI18nHelper = new I18nHelper()
}

const { i18n, i18nn, i18nc } = global.nishwI18nHelper

export { i18n, i18nn, i18nc, format }
