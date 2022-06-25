export const OrcosContextMenu = class extends HTMLElement {
    constructor() {
        super()
    }

    attachTo(el) {
        el.oncontextmenu = this.onContextMenu
        //document.onclick = () => this.style.display = 'none' 
    }

    onContextMenu(e) { 
        e.preventDefault()

        if (this.style.display == "block")
            this.style.display = 'none' 
        else {   
            this.style.display = 'block'
            this.style.left = e.pageX + 'px'
            this.style.top = e.pageY + 'px'
        } 
    } 

    get style() {
        return `
        :host { 
            position: absolute; 
          } 
          .menu {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgb(64 64 64 / 5%);
            padding: 10px 0;
          }
          .menu > li > a {
            font: inherit;
            border: 0;
            padding: 10px 30px 10px 15px;
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;
            text-decoration: unset;
            color: #000;
            font-weight: 500;
            transition: 0.5s linear;
            -webkit-transition: 0.5s linear;
            -moz-transition: 0.5s linear;
            -ms-transition: 0.5s linear;
            -o-transition: 0.5s linear;
          }
          .menu > li > a:hover {
            background:#f1f3f7;
            color: #4b00ff;
          }
          .menu > li > a > i {
            padding-right: 10px;
          }
          .menu > li.trash > a:hover {
            color: red;
          }
        `
    }

    connectedCallback() {
        let shadow = this.attachShadow({ mode: 'closed' })
        shadow.innerHTML = `
            <style scoped>${this.style}</style>
            <slot></slot>
        `
    }
}

customElements.define('orcos-context-menu', OrcosContextMenu)