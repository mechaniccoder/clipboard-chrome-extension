console.log('popup js running')

const toggleBtn = document.querySelector('.toggle-btn')

toggleBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
})
