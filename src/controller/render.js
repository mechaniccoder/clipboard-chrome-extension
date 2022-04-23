console.log('render.js')

function registerEventHandler() {
  document.addEventListener('keydown', (e) => {
    console.log(e)
  })
}

function toggleCopyBoard() {
  const board = new Board()
  const container = new Container(document.body, [board])
  container.render()

}



class Container {
  constructor(parent, children) {
    this.parent = parent
    this.children = children
  }

  get template() {
    return `
    <div class="board-container">
     ${this.children.map(c => c.render()).join('\n')}
    </div> 
    `
  }

  render() {
    this.parent.insertAdjacentHTML('beforebegin', this.template)
  }
}

class Board {
  get template() {
    return `
    <textarea class="board" placeholder="Paste here!"></textarea> 
    `
  }

  render() {
    return this.template
  }
}

toggleCopyBoard()
