/* eslint-disable max-classes-per-file */
/* eslint-disable no-continue */
const colors = require('./colors.js')

const accepted = {
  author: ['name', 'iconURL', 'url'],
  footer: ['text', 'iconURL'],
}

const buttonTypes = {
  primary: 1,
  secondary: 2,
  success: 3,
  danger: 4,
  link: 5,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
}

function parseStr(s_, errOnFail) {
  if (s_) {
    const tsd = s_.toString()
    if (errOnFail && !tsd) {
      return Error('Argument #1 must be a string!')
    }
    return tsd
  }
  if (errOnFail) return Error('Argument #1 must be a string!')
  return null
}
function parseColor(color) {
  if (typeof color === 'string') {
    color = color.toLowerCase()
    if (color === 'random') return Math.floor(Math.random() * (0xffffff + 1));
    if (color === 'default') return 0;
    color = colors[color] ?? parseInt(color.replace('#', ''), 16);
  } else if (Array.isArray(color)) {
    // eslint-disable-next-line no-bitwise
    color = (color[0] << 16) + (color[1] << 8) + color[2];
  }

  if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
  else if (Number.isNaN(color)) throw new TypeError('COLOR_CONVERT');

  return color;
}
function parseFromAllowed(object, accepted) {
  const final = {}
  for (const index in object) {
    const value = object[index]
    if (!accepted.find((e) => e === index)) continue;
    final[index] = value
  }
  return final
}
class Embed {
  constructor(options) {
    let ob = {}
    if (options && typeof (options) === 'object') {
      const obj_ = {}
      for (const index in options) {
        const element = options[index]
        obj_[index.toLowerCase()] = element
      }
      ob = obj_
    } else if (typeof (options) !== 'object') {
      Error(`Options argument must be NULL or Object! Type given: ${typeof (options)}`)
    }
    for (const i in ob) {
      this[i] = ob[i]
    }
  }

  addField(unparsedField) {
    const field = {}
    const [n, v, i] = [toString(unparsedField.name), toString(unparsedField.value), Boolean(unparsedField.inline)]
    if (n && v) {
      field.name = n
      field.value = v
      field.inline = i
    }
    if (!this.fields) this.fields = [];
    this.fields.push(field)
    return this
  }

  setColor(color) {
    this.color = parseColor(color)
    return this
  }

  setAuthor(authorObject) {
    this.author = parseFromAllowed(authorObject, accepted.author)
    return this
  }

  addFields(...args) {
    args.forEach((value) => {
      this.addField(value)
    })
    return this
  }

  setTimestamp(ts) {
    if (ts && ts instanceof Date) ts = ts.getTime();
    if (!ts) ts = Date.now()
    this.timestamp = ts;
    return this
  }

  setTitle(str) {
    this.title = parseStr(str)
    return this
  }

  setFooter(footerObject) {
    this.footer = parseFromAllowed(authorObject, accepted.footer)
    return this
  }
}

class Button {
  constructor() {
    let ob = {}
    if (options && typeof (options) === 'object') {
      const obj_ = {}
      for (const index in options) {
        const element = options[index]
        obj_[index.toLowerCase()] = element
      }
      ob = obj_
    } else if (typeof (options) !== 'object') {
      Error(`Options argument must be NULL or Object! Type given: ${typeof (options)}`)
    }
    for (const i in ob) {
      this[i] = ob[i]
    }
    this.type = 2
  }

  setEmoji(emoji) {
    this.emoji = parseStr(emoji, true)
    return this
  }

  setCustomId(id) {
    this.custom_id = parseStr(id, true)
    return this
  }

  setLabel(str) {
    this.label = parseStr(str)
    return this
  }

  setDisabled(bool) {
    if (typeof (bool) === 'boolean') {
      this.disabled = bool
    } else {
      return Error('Argument must be a boolean!')
    }
    return this
  }

  setType(buttonType) {
    if (!buttonTypes[buttonType]) return Error('Invalid button type!')
    if (typeof (buttonType) === 'number') {
      this.type = buttonTypes[buttonType]
    } else if (typeof (buttonType) === 'string') {
      this.type = buttonTypes[buttonType.toLowerCase()]
    }
    return this
  }

  setUrl(str) {
    this.url = parseStr(str)
    return this
  }
}

class ActionRow {
  constructor() {
    let ob = {}
    if (options && typeof (options) === 'object') {
      const obj_ = {}
      for (const index in options) {
        const element = options[index]
        obj_[index.toLowerCase()] = element
      }
      ob = obj_
    } else if (typeof (options) !== 'object') {
      Error(`Options argument must be NULL or Object! Type given: ${typeof (options)}`)
    }
    for (const i in ob) {
      this[i] = ob[i]
    }
    this.type = 1
  }

  addComponent(obj) {
    if (!this.components) this.components = []
    return this
  }

  addComponents(arr) {
    arr.forEach((ob) => {
      this.addComponent(ob)
    })
    return this
  }

  setComponents(arr) {
    this.components = arr
    return this
  }
}

module.exports = { // Including every shitty name d.js has used before because yea, less rewriting needed the better
  Embed,
  MessageEmbed: Embed,
  EmbedBuilder: Embed,
  Button,
  MessageButton: Button,
  ButtonBuilder: Button,
  ActionRow,
  MessageActionRow: ActionRow,
  ActionRowBuilder: ActionRow,
}
