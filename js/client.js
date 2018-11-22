chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.createMergeRequest) {
      document.querySelector('.js-create-merge-request').click()
    }
    if (request.openCheckOutBranch) {
      document.querySelector('.js-check-out-branch').click()
    }
  }
);