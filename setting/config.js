const fs = require('fs')

global.owner = "6283838956445"
global.footer = "I M R A F F B O T"
global.status = true

global.idch = '120363354282592003@g.us'

const key = 'kyuurzy'

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
