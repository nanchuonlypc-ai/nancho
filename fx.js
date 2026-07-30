

var FX_FLOAT = [];        // 떠다니는 입자 (플로팅 금지 → 비움)
var FX_COUNT = 0;         // 개수 0
var FX_CLICK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTUuNiAzLjJBOSA5IDAgMSAwIDIwLjggMTQgNy4yIDcuMiAwIDAgMSAxNS42IDMuMloiIGZpbGw9IiNGMkQ4QTAiIHN0cm9rZT0iI0I3OUJEOCIgc3Ryb2tlLXdpZHRoPSIxLjQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';       // 클릭/프사톡 모양
var FX_TILT  = false;     // 카드 기울기 OFF (플로팅 금지)
var FX_LOADER      = true;
var FX_LOADER_IMG  = '';  // 비우면 자동: 파비콘(SOOP 프사) → 글자
var FX_LOADER_TEXT = 'NANCHO';
var FX_TRANS_MS    = 720;

(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = ''
  + '#fx{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}'
  + '.fx-p{position:fixed;z-index:500;pointer-events:none;color:var(--main);transform:translate(-50%,-50%);'
  +   'animation:fxPop .9s cubic-bezier(.2,.7,.3,1) forwards;font-size:13px;line-height:1}'
  + '@keyframes fxPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.4) rotate(0)}'
  +   '16%{opacity:.95}'
  +   '100%{opacity:0;transform:translate(calc(-50% + var(--hx,0px)),calc(-50% - 66px)) scale(1.1) rotate(120deg)}}'
  + '.fx-avpop{animation:fxAv .52s cubic-bezier(.34,1.56,.64,1)}'
  + '@keyframes fxAv{0%{transform:scale(1)}38%{transform:scale(1.11)}70%{transform:scale(.97)}100%{transform:scale(1)}}'
  
  + '#fxload{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;'
  +   'gap:20px;background:var(--bg,#09070D);transition:opacity .32s ease}'
  + '#fxload.fx-hide{opacity:0;pointer-events:none}'
  + '#fxload .fxload-av{width:108px;height:108px;border:1px solid var(--line,rgba(255,255,255,.22));'
  + '#fxload .fxload-av.mascot{border:0;background:none;width:150px;height:150px;'
  +   'background-size:contain;background-repeat:no-repeat;background-position:center;filter:none;'
  +   'animation:fxBob 2.2s ease-in-out infinite}'
  + '@keyframes fxBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}'
  +   'background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;'
  +   'font-family:Arial Black,Arial,sans-serif;font-size:40px;color:var(--main,#C79BD8);'
  +   'filter:grayscale(.25) contrast(1.05)}'
  + '#fxload .fxload-name{font-size:10px;font-weight:900;letter-spacing:.42em;color:var(--main,#C79BD8);text-indent:.42em}'
  + '#fxload .fxload-bar{width:132px;height:1px;background:var(--line,rgba(255,255,255,.2));overflow:hidden}'
  + '#fxload .fxload-bar i{display:block;width:38%;height:100%;background:var(--main,#C79BD8);animation:fxScan 1.05s ease-in-out infinite}'
  + '@keyframes fxScan{0%{transform:translateX(-100%)}100%{transform:translateX(320%)}}'
  + '.fx-enter{animation:fxIn var(--fx-trans,.72s) cubic-bezier(.2,.72,.3,1) both}'
  + '@keyframes fxIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
  + '@media (prefers-reduced-motion:reduce){.fx-p,#fxload .fxload-bar i{animation:none!important}.fx-enter{animation:none!important}}';

  var st = document.createElement('style'); st.id = 'fx-style'; st.textContent = css;
  document.head.appendChild(st);

  
  var loaderOn = FX_LOADER && !reduce;
  function faviconUrl(){
    var l = document.querySelector('link[rel~="icon"]');
    return l ? l.getAttribute('href') : '';
  }
  function buildCover(){
    var c = document.createElement('div'); c.id = 'fxload';
    var av = document.createElement('div'); av.className = 'fxload-av';
    /* --char (mascot cutout) wins over the favicon, and renders without a frame. */
    var mascot = getComputedStyle(document.documentElement).getPropertyValue('--char').trim();
    var img = FX_LOADER_IMG || (mascot ? mascot.replace(/^url\(["']?|["']?\)$/g, '') : '') || faviconUrl();
    if (mascot && !FX_LOADER_IMG) av.className = 'fxload-av mascot';
    if (img && /^(data:|https?:|\.|\/)/.test(img)) av.style.backgroundImage = 'url("' + img + '")';
    else av.textContent = (FX_LOADER_TEXT || 'N').charAt(0);
    var nm = document.createElement('div'); nm.className = 'fxload-name';
    nm.textContent = FX_LOADER_TEXT || '';
    var bar = document.createElement('div'); bar.className = 'fxload-bar';
    bar.innerHTML = '<i></i>';
    c.appendChild(av); c.appendChild(nm); c.appendChild(bar);
    return c;
  }
  if (loaderOn) {
    var cover = buildCover();
    (document.body || document.documentElement).appendChild(cover);
    document.documentElement.style.setProperty('--fx-trans', (FX_TRANS_MS / 1000) + 's');
    var hide = function(){
      setTimeout(function(){
        cover.classList.add('fx-hide');
        var main = document.querySelector('.wrap') || document.querySelector('main');
        if (main) {
          main.classList.add('fx-enter');
          /* A leftover transform makes this element the containing block for
             position:fixed and absolute descendants, which throws modals and
             bottom-anchored boxes out of place. Clear it once the animation ends. */
          var clearTf = function(){
            main.classList.remove('fx-enter');
            main.style.transform = 'none';
            main.removeEventListener('animationend', clearTf);
          };
          main.addEventListener('animationend', clearTf);
          setTimeout(clearTf, FX_TRANS_MS + 300);
        }
        setTimeout(function(){ if (cover.parentNode) cover.parentNode.removeChild(cover); }, 420);
      }, 210);
    };
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 2400); // 폴백 — 영영 덮이지 않게

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^(https?:|mailto:|tel:)/.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var c2 = buildCover(); c2.classList.add('fx-hide');
      document.body.appendChild(c2);
      requestAnimationFrame(function(){ c2.classList.remove('fx-hide'); });
      setTimeout(function(){ location.href = href; }, 260);
    });
  }

  
  window.fxHearts = function (x, y, n) {
    if (reduce) return;
    n = n || 5;
    var isImg = /^data:|^https?:\/\//.test(FX_CLICK);
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          var s = document.createElement('span');
          s.className = 'fx-p';
          if (isImg) {
            s.style.width = '18px'; s.style.height = '18px';
            s.style.backgroundImage = 'url("' + FX_CLICK + '")';
            s.style.backgroundSize = 'contain';
            s.style.backgroundRepeat = 'no-repeat';
          } else {
            s.textContent = FX_CLICK;
            s.style.fontSize = (10 + Math.random() * 9).toFixed(0) + 'px';
          }
          s.style.left = x + 'px'; s.style.top = y + 'px';
          s.style.setProperty('--hx', (-34 + Math.random() * 68).toFixed(0) + 'px');
          document.body.appendChild(s);
          setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1000);
        }, i * 42);
      })(i);
    }
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('input,textarea,select,button,a,.no-fx')) return;
    window.fxHearts(e.clientX, e.clientY, 4);
  });

  
  document.addEventListener('click', function (e) {
    var av = e.target.closest && e.target.closest('#avatarWrap,.avatar');
    if (!av) return;
    window.fxHearts(e.clientX, e.clientY, 9);
    av.classList.remove('fx-avpop');
    void av.offsetWidth;
    av.classList.add('fx-avpop');
  });

  

  
  function report(){
    try {
      if (window.parent === window) return;
      window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
    } catch (e) {}
  }
  window.addEventListener('load', report);
  if (window.ResizeObserver) { try { new ResizeObserver(report).observe(document.body); } catch (e) {} }
})();
