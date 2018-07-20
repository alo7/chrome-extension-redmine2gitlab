const getValue = id => document.getElementById(id).value

const setValues = items => {
  Object.keys(items).forEach(key => {
    document.getElementById(key).value = items[key]
  }) 
} 

document.addEventListener('DOMContentLoaded', () => {
  const defaultConfig = {
    GITLAB_URL: '',
    GITLAB_PROJECT_ID: '',
    GITLAB_USER_ID: '',
    GITLAB_PRIVATE_TOKEN: '',
    REDMINE_URL: '',
    REDMINE_API_KEY: ''
  }

  chrome.storage.sync.get(defaultConfig, items => {
    setValues(items)
  })
})

document.getElementById('save').addEventListener('click', () => {
  const GITLAB_URL = getValue('GITLAB_URL')
  const GITLAB_PROJECT_ID = getValue('GITLAB_PROJECT_ID')
  const GITLAB_USER_ID = getValue('GITLAB_USER_ID')
  const GITLAB_PRIVATE_TOKEN = getValue('GITLAB_PRIVATE_TOKEN')
  const REDMINE_URL = getValue('REDMINE_URL')
  const REDMINE_API_KEY = getValue('REDMINE_API_KEY')

  const config = {
    GITLAB_URL,
    GITLAB_PROJECT_ID,
    GITLAB_USER_ID,
    GITLAB_PRIVATE_TOKEN,
    REDMINE_URL,
    REDMINE_API_KEY
  }

  chrome.storage.sync.set(config, () => {
    document.getElementById('status').textContent = '保存成功！'
    chrome.runtime.reload()
    setTimeout(() => {
      document.getElementById('status').textContent = ''
    }, 800)
  })
})
