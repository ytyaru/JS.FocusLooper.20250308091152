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
    #blacklists = [];
    addBlacklist(selector) {
        if (!this.#blacklists.includes(selector)) {
            this.#blacklists.push(selector);
            this.refresh();
        }
    }
    removeBlacklist(selector) {
        this.#blacklists = this.#blacklists.filter(s => s !== selector);
        this.refresh();
    }
    constructor() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this._i = 0;
            this._els = [...this.itr];
            // DOMの変化を監視してリストを更新
            const observer = new MutationObserver(() => this.refresh());
            observer.observe(document.body, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['class', 'style', 'disabled', 'hidden']
            });
            this.refresh();

            this._scrollAxis = {x:0, y:0}
            // スクロール時、activeElementが画面外かつフォーカス対象が画面内なら、その要素にfocus()したい
            window.addEventListener('scroll', (e)=>this.scrollAutoFocus());
            this.i = 0;
            this._el = document.activeElement;

            this.#setup();
        });
    }
    #setup() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // ブラウザ標準のTab移動を完全に殺す
                this.move(e.shiftKey ? -1 : 1);
            }
        });
    }
    // 有効な（表示されている）要素だけを抽出
    refresh() {
        const all = Array.from(document.querySelectorAll(this.#FOCUSABLE_ELEMENTS));
        this._els = all.filter(el => {
            if (el.offsetParent === null) return false;
            if (this.#blacklists.some(selector => el.closest(selector))) return false;
            return true;
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
    setFirst() {this.refresh(); this._i = 0;}
    move(dir) {
        if (this._els.length === 0) return;
        this._i = (this._i + dir + this._els.length) % this._els.length;
        this._els[this._i].focus();
    }
    reset() {this.i=0;}
    setFirst() {this.i=0;}
    setLast() {this.i=-1;}
    next() {this.i++}
    prev() {this.i--}
}
window.FocusLooper = new FocusLooper()
})()
