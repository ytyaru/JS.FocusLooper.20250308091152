(function(){
class FocusLooper {
    constructor() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this._i = 0; // index(フォーカス対象要素配列内の現在位置)
            this._els = [...this.itr];
            // DOM更新されたらフォーカス要素とインデックスを更新する
            const observer = new MutationObserver(records=>{this._els = this.#els; this._i = this.#i;});
            console.log(document.body);
            observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeOldValue: true,
                attributeFilter: 'href disabled type aria-hidden style display class tabindex contenteditable'.split(' '),
            });
            this._scrollAxis = {x:0, y:0}
            // スクロール時、activeElementが画面外かつフォーカス対象が画面内なら、その要素にfocus()したい
            window.addEventListener('scroll', (e)=>{
//                console.log(e);
                this.scrollAutoFocus();
            });
            this.i = 0;
            this._el = document.activeElement;
        });
    }
    /*
    #getScrollXDir(b) {
             if (this._scrollAxis.y===b.y) {return 'equal'}
        else if (this._scrollAxis.y > b.y) {return 'up'}
        else {return 'down'}
    }
    #getScrollYDir(b) {
             if (this._scrollAxis.y===b.y) {return 'equal'}
        else if (this._scrollAxis.y > b.y) {return 'left'}
        else {return 'right'}
    }
    #getAutoFocusCandidateEls(sy) {
        if ('eq'===sy) {return []}
        else if ('up'===sy) {return this.els.slice(0, this.i)}
        else {return this.els.slice(this.i)}
    }
    */
    scrollAutoFocus() {//スクロール時にactiveElementが画面外にあり、かつフォーカス対象要素が画面内にあるならそこにフォーカスする
        const b = document.activeElement?.getBoundingClientRect();
        if (!b) {return}
        const W = document.documentElement.clientWidth;
        const H = document.documentElement.clientHeight;
        if (0<=b.x && b.x<=W && 0<=b.y && b.y<=H) {return} // activeElementが画面内にある
        console.log(this.i, this.els.slice(this.i))
//        const sx = this.#getScrollXDir(b);
//        const sy = this.#getScrollXDir(b);
//        this._scrollAxis.y = b.y;
//        this._scrollAxis.x = b.x;
//        const cands = this.#getAutoFocusCandidateEls(sy);
//        const isUp = this._scrollAxis.y > b.y
//        const isLeft = this._scrollAxis.x
        // activeElement以前／以降の要素が（スクロール方向によって対象が変わる）
        //for (let el of this.els.slice(this.i)) {// activeElement以降の要素が
        //for (let el of this.els) {
        for (let i=0; i<this.l; i++) {
            const B = this.els[i].getBoundingClientRect();
            if (0<=B.x && B.x<=W && 0<=B.y && B.y<=H) {this.i=i;console.log('!!!!!', this.el);return;} // 画面内にあればフォーカスする
        }
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
        if (0===l) {return}
        if (v < 0) {this._i = Math.abs((l + v) % l)}   // 負数なら逆順
        else if (0<=v<=l){this._i = v} // 範囲内ならそのまま
        else {this._i = v % l}         // 範囲外なら剰余
        els[this._i].focus();
    }
    setup(textarea) {
        this.textarea = textarea
        window.addEventListener('keydown', async(e) => {
            if ('Esc'===e.code) return
            if ('Tab'===e.code) this.#retainFocus(e)
        })
        this.i=0;
    }
    reset() { this.i=0; }
    setFirst() {this.i=0;}
    setLast() {this.i=this.els.length-1}
    next() {this.i++}
    prev() {this.i--}
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
}
window.FocusLooper = new FocusLooper()
})()
