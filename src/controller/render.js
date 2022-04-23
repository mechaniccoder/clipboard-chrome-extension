const clipboardWrapperId = 'copy-board-chrome-extensions-container'

class ClipboardModel {
  constructor() {
    this.id = 1;
    this.clipboards = [{id: this.id, text: ''}]
  }

  getAll() {
    return this.clipboards
  }

  addOne() {
    this.id += 1;
    this.clipboards.push({id: this.id, text: ''})
  }

  updateOne(id, text) {
    const aClipboard = this.clipboards.find(clipboard => clipboard.id === id)
    console.log(JSON.stringify(this.clipboards))
    if (!aClipboard) throw new Error(`id = ${id}`)
    aClipboard.text = text
  }

  deleteOne(id) {
    this.clipboards = this.clipboards.filter(clipboard => clipboard.id !== id)
  }
}

class ClipboardController {
  constructor(clipboardView, clipboardModel) {
    this.clipboardView = clipboardView
    this.clipboardModel = clipboardModel
  }

  addClipboard() {
    this.clipboardModel.addOne()
    this.updateView()
  }

  updateClipboardText(id, text) {
    this.clipboardModel.updateOne(id, text)
  }

  updateView() {
    this.clipboardView.render(this.clipboardModel.getAll())
  }
}

class ClipboardView {
  constructor() {
    this.container = null;
    this.appendContainer()
  }

  template(clipboards) {
    return `
   <ul class="clipboard-container">
      ${clipboards.map(clipboard => ` 
        <li>
            <textarea id="${clipboard.id}" class="clipboard" placeholder="Paste whatever you want to use!">${clipboard.text}</textarea>
        </li>
        `).join('')}
      <button class="add-btn">Add</button>
     </ul>
   `
  }

  appendContainer() {
    const div = document.createElement('div')
    div.id = clipboardWrapperId
    this.container = div;
    document.body.append(div)
  }

  render(clipboards) {
    // if (this.container === null) {
    //   this.appendContainer()
    // }
    this.container.innerHTML = this.template(clipboards)
  }
}

class EventRegistry {
  constructor(handlers, controller) {
    this.controller = controller
    this.handlers = handlers
  }

  register() {
    this.handlers.forEach(handler => handler(this.controller))
  }
}

function getEventHandlers() {
  function onChangeClipboardText(controller) {
    const clipboardContainer = document.getElementById(clipboardWrapperId)
    clipboardContainer.addEventListener('input', (e) => {
      controller.updateClipboardText(Number(e.target.id), e.target.value)
    })
  }

  function onToggleClipboardView() {
    window.addEventListener('keydown', (e) => {
      const clipboardContainer = document.querySelector('.clipboard-container')
      if (e.altKey && e.shiftKey && e.altKey && e.code === 'ArrowUp') {
        clipboardContainer.classList.remove('hide')
      }

      if (e.altKey && e.shiftKey && e.altKey && e.code === 'ArrowDown') {
        clipboardContainer.classList.add('hide')
      }
    })
  }

  function onAddClipboard(controller) {
    const addBtn = document.getElementById(clipboardWrapperId)
    addBtn.addEventListener('click', (e) => {
      if (e.target.closest('.add-btn')) {
        controller.addClipboard()
      }
    })
  }

  return [onToggleClipboardView, onAddClipboard, onChangeClipboardText]
}


function main() {
  const clipboardController = new ClipboardController(new ClipboardView(), new ClipboardModel())
  clipboardController.updateView()

  const handlers = getEventHandlers()
  const eventRegistry = new EventRegistry(handlers, clipboardController)
  eventRegistry.register()
}

main()
