(function(){
class FocusLooper {
    constructor() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this._i = 0; // index
            this._els = [...this.itr];
            const observer = new MutationObserver(records=>{this._els = this.#els; this._i = this.#i;});
            console.log(document.body);
            observer.observe(document.body, {
                // オプションを指定
                subtree: true,
                childList: true,
                attributes: true,
                attributeOldValue: true,
                attributeFilter: 'href disabled type aria-hidden style display class tabindex contenteditable'.split(' '),
            });
        });
    }
    #FOCUSABLE_ELEMENTS = [
        'a[href]:not([display="none"])',
        'area[href]:not([display="none"])',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden]):not([display="none"])',
        'select:not([disabled]):not([aria-hidden]):not([display="none"])',
        'textarea:not([disabled]):not([aria-hidden]):not([display="none"])',
        'button:not([disabled]):not([aria-hidden]):not([display="none"])',
        'iframe:not([display="none"])',
        'object:not([display="none"])',
        'embed:not([display="none"])',
        '[contenteditable]:not([display="none"])',
        '[tabindex]:not([tabindex^="-"]):not([display="none"])',
        '*.focusable'
    ]
    get #els() {return [...this.itr].filter(el=>null!==el.offsetParent)}
    get itr() {return document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)}
    get els() {return this._els}
    get el() {return document.activeElement}
    get l() {return this.els.length}
    get #i() {return this.els.indexOf(document.activeElement)}
    get i() {return this._i}
    set i(v) {
        if (!Number.isInteger(v)){throw new TypeError(`iの代入値は整数であるべきです:${v}`)}
        const els = this.els;
        const l = els.length;
        if (v < 0) {this._i = Math.abs((l + v) % l)}   // 負数なら逆順
        else if (0<=v<=l){this._i = v} // 範囲内ならそのまま
        else {this._i = v % l}         // 範囲外なら剰余
        els[this._i].focus();
    }
    /*
    set i(v) {
        if (Number.isInteger(v)) {this.setIndex(v)}
        else if (v instanceof HTMLElement) {this.setElement(v)}
        else {throw new TypeError(`iの代入値は整数かHTMLElementであるべきです:${v}`)}
    }
    setIndex(v) {
        if (!Number.isInteger(v)){throw new TypeError(`iの代入値は整数であるべきです:${v}`)}
        const els = this.els;
        const l = els.length;
        if (v < 0) {this._i = Math.abs((l + v) % l)}   // 負数なら逆順
        else if (0<=v<=l){this._i = v} // 範囲内ならそのまま
        else {this._i = v % l}         // 範囲外なら剰余
        els[this._i].focus();
    }
    setElement(v) {
        if (!(v instanceof HTMLElement)) {throw new TypeError(`setElementの引数はHTMLElementであるべきです:${v}`)}
        if (!document.contains(v)) { throw new TypeError(`setElementの引数はdocumentにappendされていません。`) }
        v.focus();
    }
    */
    setup(textarea) {
        this.textarea = textarea
        window.addEventListener('keydown', async(e) => {
            if ('Esc'===e.code) return
            if ('Tab'===e.code) this.#retainFocus(e)
        })
        /*
        // ボタンは矢印キーを押すとフォーカスがbodyに飛んでしまうので、矢印キーの操作を殺した
        for (let button of document.querySelectorAll('button')) {
            button.addEventListener('keydown', async(e) => {
                if (['Right','Left','Up','Down'].some((key)=>`Arrow${key}`===e.code)) e.preventDefault()
                else if ('Esc'===e.code) this.textarea.focus()
            })
        }
        */
        this.#setFocusToFirstNode()
    }
    reset() { this.#setFocusToFirstNode() }
    setFirst() {this.i=0;}
    setLast() {this.i=this.els.length-1}
    next() {this.i++}
    prev() {this.i--}
    /*
    //#getFocusableNodes() { return [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)] }
    //#getShowNode() { return document.querySelector(`[data-sid]:not([display="none"]`) || document } // 動的変更したdisplay値が取得できない！
    #getShowNode() {
        for (let el of document.querySelectorAll(`[data-sid]`)) {
            const display = Css.get('display', el)
            console.log('display:', display)
            if ('none'!==display) { return el }
        }
        return document
    }
    //#getFocusableNodes() { console.log(this.#getShowNode());return [...this.#getShowNode().querySelectorAll(this.#FOCUSABLE_ELEMENTS)] }
    */
    #getFocusableNodes() { return [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)] }
    #setFocusToFirstNode() {
        const nodes = this.#getFocusableNodes()
        if (nodes.length > 0) nodes[0].focus()
        console.log(nodes)
    }
    #retainFocus(e) {
        console.log(`e.code:${e.code}`, e)
        const els = this.els;
        const l = els.length;
        console.log(els)
        if (l === 0) { return }
        if (!document.contains(document.activeElement)) { els[0].focus() }
        else {
            const i = this.#i;
            if (e.shiftKey && i === 0) {
                els[l - 1].focus()
                e.preventDefault()
            }
            if (!e.shiftKey && l > 0 && i === l - 1) {
                els[0].focus()
                e.preventDefault()
            }
        }
    }
    /*
    #retainFocus(e) {
        console.log(`e.code:${e.code}`, e)
        let nodes = this.#getFocusableNodes()
        console.log(nodes)
        if (nodes.length === 0) return
        nodes = nodes.filter(node=>(node.offsetParent !== null))
        if (!document.contains(document.activeElement)) { nodes[0].focus() }
        else {
            const focusedItemIndex = nodes.indexOf(document.activeElement)
            if (e.shiftKey && focusedItemIndex === 0) {
                nodes[nodes.length - 1].focus()
                e.preventDefault()
            }
            if (!e.shiftKey && nodes.length > 0 && focusedItemIndex === nodes.length - 1) {
                nodes[0].focus()
                e.preventDefault()
            }
        }
    }
    */
}
window.FocusLooper = new FocusLooper()
})()
