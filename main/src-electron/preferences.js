const path = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { app } = require('electron')

const Preferences = {

  data: {
    pluginDataDir: '',
    dbFilePath: ''
  },

  load: () => {
    if (existsSync(Preferences.getFilePath())) {
      Preferences.data = JSON.parse(readFileSync(Preferences.getFilePath()))

      // validate
      if (!existsSync(Preferences.data.pluginDataDir)) {
        Preferences.data.pluginDataDir = Preferences.getDefaultPluginDataDir()
      }
      if (!existsSync(Preferences.data.dbFilePath)) {
        Preferences.data.dbFilePath = Preferences.getDefaultDBPath()
      }
    } else {
      console.log('load')
      Preferences.data.pluginDataDir = Preferences.getDefaultPluginDataDir()
      Preferences.data.dbFilePath = Preferences.getDefaultDBPath()
      Preferences.save()
    }
  },

  save: () => {
    writeFileSync(Preferences.getFilePath(), JSON.stringify(Preferences.data))
  },

  // Alt Army
  getAppName: () => {
    return 'Alt Army'
  },

  // C:\Users\<username>\AppData\Roaming\Alt Army
  getAppData: () => {
    return app.getPath('appData') + path.sep + Preferences.getAppName()
  },

  // alt-army.prefs.json
  getFilename: () => {
    return 'alt-army.prefs.json'
  },

  // C:\Users\<username>\AppData\Roaming\Alt Army\alt-army.prefs.json
  getFilePath: () => {
    return Preferences.getAppData() + path.sep + Preferences.getFilename()
  },

  // C:\Users\<username>\Documents\The Lord of the Rings Online\PluginData
  getDefaultPluginDataDir: () => {
    return app.getPath('documents') + path.sep + 'The Lord of the Rings Online' + path.sep + 'PluginData'
  },

  // C:\Users\<username>\AppData\Roaming\Alt Army\alt-army.db
  getDefaultDBPath: () => {
    return Preferences.getAppData() + path.sep + 'alt-army.db'
  }

}

module.exports = { Preferences }
