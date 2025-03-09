(function(){
class FocusLooper {
    #FOCUSABLE_ELEMENTS = [
        'a[href]:not([display="none"]):not(.not-focasable)',
        'area[href]:not([display="none"]):not(.not-focasable)',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden]):not([display="none"]):not(.not-focasable)',
        'select:not([disabled]):not([aria-hidden]):not([display="none"]):not(.not-focasable)',
        'textarea:not([disabled]):not([aria-hidden]):not([display="none"]):not(.not-focasable)',
        'button:not([disabled]):not([aria-hidden]):not([display="none"]):not(.not-focasable)',
        'iframe:not([display="none"]):not(.not-focasable)',
        'object:not([display="none"]):not(.not-focasable)',
        'embed:not([display="none"]):not(.not-focasable)',
        '[contenteditable]:not([display="none"]):not(.not-focasable)',
        '[tabindex]:not([tabindex^="-"]):not([display="none"]):not(.not-focasable)',
        '*.focusable'
    ];
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
            window.addEventListener('scroll', (e)=>this.scrollAutoFocus());
            this.i = 0;
            this._el = document.activeElement;
        });
    }
    scrollAutoFocus() {//スクロール時にactiveElementが画面外にあり、かつフォーカス対象要素が画面内にあるならそこにフォーカスする
        const b = document.activeElement?.getBoundingClientRect();
        if (!b) {return}
        const W = document.documentElement.clientWidth;
        const H = document.documentElement.clientHeight;
        if (0<=b.x && b.x<=W && 0<=b.y && b.y<=H) {return} // activeElementが画面内にある
        for (let i=0; i<this.l; i++) {
            const B = this.els[i].getBoundingClientRect();
            if (0<=B.x && B.x<=W && 0<=B.y && B.y<=H) {this.i=i;return;} // 画面内にあればフォーカスする
        }
    }
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
        else if (l<=v) {this._i = v % l} // 範囲外なら剰余
        else {this._i = v}               // 範囲内ならそのまま
        els[this._i]?.focus();
        console.log(`i:`, this.i)
    }
    setup() {
        window.addEventListener('keydown', async(e) => {
            //if ('Tab'===e.code) {this.keydown(e)}
            this.keydown(e);
        })
        this.i=0;
    }
    reset() {this.i=0;}
    setFirst() {this.i=0;}
    setLast() {this.i=this.els.length-1}
    next() {this.i++}
    prev() {this.i--}
    keydown(e) {
        if ('Tab'!==e.code){return}
        const els = this.els;
        const l = els.length;
        if (l === 0) { console.log('l === 0');return }
        if (!document.contains(document.activeElement)) { console.log('contains!!!!!!!');this.i=0; }
        else {
            const i = this.#i;
                 if ( e.shiftKey && i===0) {this.i = l-1; console.log('S:', this.i); e.preventDefault();}
            else if (!e.shiftKey && 0<l && l-1===i){this.i=0; console.log('!S:',this.i); e.preventDefault();}
            else if (!e.shiftKey && 0<l && this._i < this.l) {this._i++}
            else if ( e.shiftKey && 0<this._i) {this._i--}
            console.log(`i:`, this.i, i)
        }
        
    }
}
window.FocusLooper = new FocusLooper()
})()
