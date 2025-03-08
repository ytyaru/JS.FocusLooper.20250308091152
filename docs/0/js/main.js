window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const author = 'ytyaru';
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/JS.FocusLooper.20250308091152/`}, 'FocusLooper')),
        van.tags.p('HTML内の要素間でフォーカスをループする。'),
//        van.tags.p('Loops focus between elements in HTML.'),
    );
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make());

    const a = new Assertion();
    a.t(true);
    a.f(false);
    a.e(TypeError, `msg`, ()=>{throw new TypeError(`msg`)});
    a.fin();

    FocusLooper.setup();
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

