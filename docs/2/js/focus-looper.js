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
            // スクロール時、activeElementが画面外かつフォーカス対象が画面内なら、その要素にfocus()したい
            window.addEventListener('scroll', (e)=>{
                this.el
            });
            this.i = 0;
            this._el = document.activeElement;
        });
    }
    withinActiveElement() {// activeElementが画面内にあるなら真を返す
        /*
        window.scrollX
        window.scrollY
        // スクロール位置を取得
//        const scrollTop = window.scrollTop();
//        const scrollBtm = scrollTop + window.height;
        const scrollTop = window.scrollTop();
        const scrollBtm = scrollTop + window.height;

        // 対象要素の位置を取得
        const target = document.activeElement;
        const targetTop = target.offset.top;
        const targetBtm = targetTop + target.height;

        return scrollBtm > targetTop && scrollTop < targetBtm;
        */
        /*
        // 画面内にある場合
        if (scrollBtm > targetTop && scrollTop < targetBtm) {
            target.addClass('is-show');
        } else {
            target.removeClass('is-show');
        }
        */
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
