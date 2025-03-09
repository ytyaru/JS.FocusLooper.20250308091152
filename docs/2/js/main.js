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

    document.querySelector(`#a-js-off`).style.display = 'none';
    document.querySelector(`#button-js-off`).style.display = 'none';
    FocusLooper.setup();
    console.log(FocusLooper.els);
    document.querySelector(`#switch`).addEventListener('change', (e)=>{
        if ('on'===e.target.value) {
            document.querySelector(`#a-js-off`).style.display = 'inline';
            document.querySelector(`#button-js-off`).style.display = 'inline';
        } else {
            document.querySelector(`#a-js-off`).style.display = 'none';
            document.querySelector(`#button-js-off`).style.display = 'none';
        }
    });
    document.querySelector(`#add`).addEventListener('click', (e)=>{
        document.querySelector(`main`).append(van.tags.input())
    });
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

