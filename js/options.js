document.addEventListener('DOMContentLoaded', function() {
  const config = {
    GITLAB_URL: '',
    GITLAB_PROJECT_ID: '',
    GITLAB_USER_ID: '',
    GITLAB_PRIVATE_TOKEN: '',
    REDMINE_URL: '',
    REDMINE_API_KEY: ''
  }
  chrome.storage.sync.get(config, function(items) {
    document.getElementById('git_url').value = items.GITLAB_URL
    document.getElementById('git_id').value = items.GITLAB_PROJECT_ID
    document.getElementById('git_uid').value = items.GITLAB_USER_ID
    document.getElementById('git_token').value = items.GITLAB_PRIVATE_TOKEN
    document.getElementById('redmine_url').value = items.REDMINE_URL
    document.getElementById('redmine_key').value = items.REDMINE_API_KEY
  })
})

document.getElementById('save').addEventListener('click', function() {
  const GITLAB_URL = document.getElementById('git_url').value
  const GITLAB_PROJECT_ID = document.getElementById('git_id').value
  const GITLAB_USER_ID = document.getElementById('git_uid').value
  const GITLAB_PRIVATE_TOKEN = document.getElementById('git_token').value
  const REDMINE_URL = document.getElementById('redmine_url').value
  const REDMINE_API_KEY = document.getElementById('redmine_key').value

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
