# DiscordMessageObjects
Message object constructors (embed, button, etc)

This is meant to closely resemble Discord.js' constructors as to make it so if you use these, very little rewriting will be needed.

(This was made for being used with Eris)

**Feel free to PR if you think anything should be added or modified!**


## Example of usage (In eris)
```js
const { MessageEmbed, MessageActionRow, MessageButton } = require('./messageObjects.js')
const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Hewwo')
        .setDescription('x3')
        .setAuthor({
          name: 'OwO?',
          iconURL: client.user.avatarURL,
        })
        .setTimestamp()
i.createMessage({content: 'UwU', embeds: [embed]})
```
