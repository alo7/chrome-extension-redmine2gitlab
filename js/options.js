const getValue = id => document.getElementById(id).value

document.addEventListener('DOMContentLoaded', () => {
  const config = {
    GITLAB_URL: '',
    GITLAB_PROJECT_ID: '',
    GITLAB_USER_ID: '',
    GITLAB_PRIVATE_TOKEN: '',
    REDMINE_URL: '',
    REDMINE_API_KEY: ''
  }

  chrome.storage.sync.get(config, items => {
    getValue('git_url') = items.GITLAB_URL
    getValue('git_id') = items.GITLAB_PROJECT_ID
    getValue('git_uid') = items.GITLAB_USER_ID
    getValue('git_token') = items.GITLAB_PRIVATE_TOKEN
    getValue('redmine_url') = items.REDMINE_URL
    getValue('redmine_key') = items.REDMINE_API_KEY
  })
})

document.getElementById('save').addEventListener('click', () => {
  const GITLAB_URL = getValue('git_url')
  const GITLAB_PROJECT_ID = getValue('git_id')
  const GITLAB_USER_ID = getValue('git_uid')
  const GITLAB_PRIVATE_TOKEN = getValue('git_token')
  const REDMINE_URL = getValue('redmine_url')
  const REDMINE_API_KEY = getValue('redmine_key')

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
    setTimeout(() => {
      document.getElementById('status').textContent = ''
    }, 800)
  })
})
