/* eslint-disable max-classes-per-file */
/* eslint-disable no-continue */
const colors = require('./colors.js')

const accepted = {
  author: ['name', 'iconURL', 'url'],
  footer: ['text', 'iconURL'],
  button: ['type', 'emoji', 'custom_id', 'disabled', 'style'],
  selectMenu: ['label', 'value', 'description', 'emoji'],
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
const emojiRegex = /\p{Emoji}/u
const animatedEmojiRegex = /<a:[a-zA-Z0-1_]+:\d+>/gm
const normalEmojiRegex = /<[a-zA-Z0-1_]+:\d+>/gm
function createEmojiObject(str) {
  const isEmoji = emojiRegex.test(str)
  const isNormal = normalEmojiRegex.test(str)
  const isAnimated = animatedEmojiRegex.test(str)
  const parts = str.split(':')
  if (isEmoji) {
    return {
      id: null,
      name: str,
    }
  } if (isNormal) {
    return {
      id: parts[1],
      name: parts[0],
    }
  } if (isAnimated) {
    return {
      id: parts[2],
      name: parts[1],
    }
  }
  return null
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

  setFields(...args) {
    this.fields = []
    this.addFields(...args)
  }

  setTimestamp(timestamp) {
    if (!timestamp) {
      timestamp = new Date().toISOString()
    } else if (timestamp instanceof (Date)) {
      timestamp = timestamp.toISOString()
    }
    this.timestamp = timestamp
    return this
  }

  setTitle(str) {
    this.title = parseStr(str)
    return this
  }

  setFooter(footerObject) {
    this.footer = parseFromAllowed(footerObject, accepted.footer)
    return this
  }

  setDescription(str) {
    this.description = parseStr(str)
    return this
  }

  done() {
    return JSON.parse(JSON.stringify(this))
  }
}

class Button {
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
    this.type = 2
  }

  setEmoji(emoji) {
    const parsed = parseStr(emoji, true)
    const emojiObject = createEmojiObject(parsed)
    this.emoji = emojiObject
    return this
  }

  setCustomId(id) {
    const customId = parseStr(id, true)
    this.custom_id = customId
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

  setStyle(buttonType) {
    if (typeof (buttonType) === 'number' && buttonTypes[buttonType]) {
      this.style = buttonTypes[buttonType]
    } else if (typeof (buttonType) === 'string' && buttonTypes[buttonType.toLowerCase()]) {
      this.style = buttonTypes[buttonType.toLowerCase()]
    } else {
      return Error('Invalid button style!')
    }
    return this
  }

  setUrl(str) {
    this.url = parseStr(str)
    return this
  }

  done() {
    return JSON.parse(JSON.stringify(this))
  }
}

class SelectMenu {
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
    this.type = 3
  }

  setCustomId(id) {
    const customId = parseStr(id, true)
    this.custom_id = customId
    return this
  }

  addOption(obj) {
    if (!this.options) this.options = []
    const converted = {}
    for (const index in obj) {
      let item = obj[index]
      if (item === 'emoji') item = createEmojiObject(item)
      converted[item] = index
    }
    const newObj = parseFromAllowed(obj, accepted.selectMenu)
    this.options.push(newObj)
    console.log(this)
    return this
  }

  addOptions(...args) {
    args.forEach((ob) => {
      this.addOption(ob)
    })
    return this
  }

  setPlaceholder(str) {
    const placeHolder = parseStr(str, true)
    this.placeholder = placeHolder
    return this
  }

  setMaxValues(int) {
    if (int > 25) return Error('You can only have 25 max selectable values!')
    this.max_values = int
  }

  setMinValues(int) {
    if (int > 25) return Error('You can only have 25 max selectable values!')
    this.max_values = int
  }

  setDisabled(bool) {
    if (typeof (bool) === 'boolean') {
      this.disabled = bool
    } else {
      return Error('Argument must be a boolean!')
    }
    return this
  }

  done() {
    return JSON.parse(JSON.stringify(this))
  }
}

class ActionRow {
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
    this.type = 1
  }

  addComponent(obj) {
    if (!this.components) this.components = []
    const allowedItems = [].concat(accepted.button, accepted.selectMenu)
    this.components.push(parseFromAllowed(obj, allowedItems))
    return this
  }

  addComponents(...args) {
    args.forEach((ob) => {
      this.addComponent(ob)
    })
    return this
  }

  setComponents(arr) {
    this.components = arr
    return this
  }

  done() {
    return JSON.parse(JSON.stringify(this))
  }
}

module.exports = { // Including every shitty name d.js has used before because yea, less rewriting needed the better
  Embed,
  MessageEmbed: Embed,
  EmbedBuilder: Embed,
  Button,
  MessageButton: Button,
  ButtonBuilder: Button,
  SelectMenu,
  MessageSelectMenu: SelectMenu,
  SelectMenuBuilder: SelectMenu,
  ActionRow,
  MessageActionRow: ActionRow,
  ActionRowBuilder: ActionRow,
}
