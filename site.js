

var NANCHO = {
  soop: 'blackchu',
  station: 'https://www.sooplive.com/station/blackchu',
  youtube: 'https://www.youtube.com/@blackchu',
  cafe: 'https://cafe.naver.com/magicpanty',
  melo: 'https://meloming.com/channel/nancho',
  birth: '12-16',
  debut: '2018-11-22'
};

function esc(t){
  return String(t == null ? '' : t)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function txt(v){
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(txt).filter(Boolean).join(', ');
  if (typeof v === 'object'){
    var keys = ['name','label','title','text','value'];
    for (var i=0;i<keys.length;i++) if (v[keys[i]] != null) return txt(v[keys[i]]);
    try { return Object.values(v).map(txt).filter(Boolean).join(' · '); } catch(e){ return ''; }
  }
  return String(v);
}

function lines(v){
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(txt).filter(Boolean);
  return String(v).split(/\r?\n|,(?![^(]*\))/).map(function(s){return s.trim();}).filter(Boolean);
}
function pad2(n){ return (n < 10 ? '0' : '') + n; }
function fmtDate(d){
  if (!d) return '';
  var x = new Date(d);
  if (isNaN(x)) return String(d);
  return x.getFullYear() + '.' + pad2(x.getMonth()+1) + '.' + pad2(x.getDate());
}
function toast(msg){
  if (typeof showToast === 'function') return showToast(msg);
  var t = document.getElementById('toast');
  if (!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2400);
}
function ready(){ document.body.classList.add('ready'); }

function fxDday(mmdd){
  if (!mmdd) return null;
  var m = String(mmdd).match(/(\d{1,2})\D+(\d{1,2})/);
  if (!m) return null;
  var now = new Date(), y = now.getFullYear();
  var t = new Date(y, +m[1]-1, +m[2]);
  var today = new Date(y, now.getMonth(), now.getDate());
  if (t < today) t = new Date(y+1, +m[1]-1, +m[2]);
  return Math.round((t - today) / 86400000);
}
function fxDsince(ymd){
  if (!ymd) return null;
  var d = new Date(ymd);
  if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}
window.fxDday = fxDday; window.fxDsince = fxDsince;

var BG = { night:'', day:'' };
function applyShot(){
  var day = document.body.classList.contains('day');
  var u = day ? BG.day : BG.night;
  if (u) document.body.style.setProperty('--shot', 'url("' + u + '")');
  else   document.body.style.removeProperty('--shot');
}
function applyMode(mode){
  var day = mode === 'light';
  document.body.classList.toggle('day', day);
  applyShot();
  var btns = document.querySelectorAll('[data-mode]');
  for (var i=0;i<btns.length;i++) btns[i].textContent = day ? 'NIGHT' : 'DAY';
  try{ localStorage.setItem('theme', day ? 'light' : 'dark'); }catch(e){}
}
function toggleMode(){
  applyMode(document.body.classList.contains('day') ? 'dark' : 'light');
}

var PF_DEFAULT = {
  'avatar':'', 'soop-id':'blackchu',
  'hero-art':'', 'fan-char':'/assets/nancho-bunny.png',
  'main-photo':'', 'bg-night':'', 'bg-day':'',
  'site-tagline':'THE MIDNIGHT LOG · 자정의 기록실',
  'main-story':'게임과 이야기 사이, 밤의 주파수를 맞춰요.',
  'info-motif':'별 · 달 · 밤하늘 / 팬캐릭터 토끼',
  'fandom-note':'난초를 듣는 사람들',
  'sub-profile':'밤하늘 속에 피어난 사람. 난초라는 주파수를 이루는 모든 항목을 한 장에 적어둔 기록실.',
  'sub-notice':'전파를 타기 전에 먼저 알려두는 것들. 고정 공지가 맨 위에 걸립니다.',
  'sub-schedule':'이번 달 전파 편성표. 색은 방송 종류, 굵게 표시된 칸은 놓치면 아쉬운 날.',
  'sub-work':'방송에서 쌓인 것들은 사라지지 않고 장부에 남습니다. 오늘도 성실히 적립 중.',
  'sub-diary':'방송이 끝나고 남는 이야기들. 짧아도 길어도, 그날의 주파수를 그대로 적어둡니다.',
  'sub-song':'KPOP 위주로 쌓아둔 목록. 곡을 누르면 신청하기 좋게 복사되고, 랜덤 선곡도 됩니다.',
  'sub-dress':'난초가 걸쳤던 것들을 한 장의 컨택트 시트로. 분류를 눌러 걸러 보고, 컷을 눌러 크게 봅니다.',
  'sub-game':'방송이 끝난 뒤에도 불이 꺼지지 않는 구역. 사다리로 벌칙을 정하고, 룰렛으로 당첨자를 뽑습니다.',
  'info-name':'난초', 'info-reading':'NANCHO',
  'info-catchphrase':'밤하늘 속에 피어난',
  'info-debut':'2018-11-22', 'info-birth':'12월 16일',
  'info-fandom':'초단', 'info-agency':'패러블', 'info-gender':'여',
  'info-mbti':'', 'info-content':'게임 / 저챗 / 노래 / 싱크룸',
  'info-time':'오후 5시 전후', 'info-game':'마인크래프트, 배틀그라운드',
  'info-song':'KPOP 위주 · 정기적으로 부름',
  'info-tags':'개구쟁이, 밝음, 짱구, 별, 달, 밤하늘',
  'quote':'우우우~ 예쁜누나다 / 와따! / 웨우~!',
  'msg':'밤이 깊어질수록 선명해지는 주파수.\n게임하고, 떠들고, 노래하고 — 자정 언저리에 제일 잘 잡혀요.\n초단이면 누구든 환영, 조용히 듣기만 해도 좋아요.',
  'now':'',
  'like-list':'초단\n초코맛\n초코비\n미쯔\n하겐다즈',
  'dislike-list':'벌레',
  'stats':'텐션:92\n개구쟁이:97\n노래:85\n게임:80\n집중력:63',
  'milestones':'2018.11.22|첫 송출 — 전파 개통\n진행중|초단들과 밤마다 주파수 맞추는 중',
  'tmi-food':'초코비 · 하겐다즈',
  'tmi-song':'헤비 Be I / 첫 키스에 내 심장은 120BPM',
  'tmi-game':'마인크래프트, 배틀그라운드',
  'tmi-book':'',
  'txt-t-profile-1':'',
  'txt-t-profile-2':'',
  'txt-t-profile-3':'',
  'txt-t-profile-4':'',
  'txt-t-profile-5':'',
  'txt-t-profile-6':'',
  'txt-t-profile-7':'',
  'txt-t-profile-8':'',
  'txt-t-profile-9':'',
  'txt-t-profile-10':'',
  'txt-t-notice-1':'',
  'txt-t-schedule-1':'',
  'txt-t-schedule-2':'',
  'txt-t-work-1':'',
  'txt-t-diary-1':'',
  'txt-t-song-1':'',
  'txt-t-song-2':'',
  'txt-t-song-3':'',
  'txt-t-dress-1':'',
  'txt-t-game-1':'',
  'txt-t-game-2':'',
  'txt-t-game-3':'',
  'txt-t-game-4':'',
  'txt-t-index-1':'',
  'txt-t-profile-11':'',
  'txt-t-profile-12':'',
  'txt-t-profile-13':'',
  'txt-t-profile-14':'',
  'txt-t-profile-15':'',
  'txt-t-profile-16':'',
  'txt-t-profile-17':'',
  'txt-t-profile-18':'',
  'txt-t-profile-19':'',
  'txt-t-profile-20':'',
  'txt-t-profile-21':'',
  'txt-t-profile-22':'',
  'txt-t-profile-23':'',
  'txt-t-profile-24':'',
  'txt-t-profile-25':'',
  'txt-t-profile-26':'',
  'txt-t-profile-27':'',
  'txt-t-profile-28':'',
  'txt-t-profile-29':'',
  'txt-t-profile-30':'',
  'txt-t-profile-31':'',
  'txt-t-schedule-3':'',
  'txt-t-schedule-4':'',
  'txt-t-schedule-5':'',
  'txt-t-diary-2':'',
  'txt-t-song-4':'',
  'txt-t-game-5':'',
  'txt-t-game-6':'',
  'txt-t-game-7':'',
  'txt-t-game-8':'',
  'txt-nav-1':'',
  'txt-nav-2':'',
  'txt-nav-3':'',
  'txt-nav-4':'',
  'txt-nav-5':'',
  'txt-nav-6':'',
  'txt-nav-7':'',
  'txt-nav-8':'',
  'txt-nav-9':'',
  'txt-t-profile-2':'',
  'txt-t-profile-3':'',
  'txt-t-profile-4':'',
  'txt-t-profile-5':'',
  'txt-t-profile-6':'',
  'txt-t-profile-7':'',
  'txt-t-profile-8':'',
  'txt-t-profile-9':'',
  'txt-t-profile-10':'',
  'txt-t-notice-1':'',
  'txt-t-schedule-1':'',
  'txt-t-schedule-2':'',
  'txt-t-work-1':'',
  'txt-t-diary-1':'',
  'txt-t-song-1':'',
  'txt-t-song-2':'',
  'txt-t-song-3':'',
  'txt-t-dress-1':'',
  'txt-t-game-1':'',
  'txt-t-game-2':'',
  'txt-t-game-3':'',
  'txt-t-game-4':'',
  'type-display':'1', 'type-title':'1', 'type-body':'1', 'type-label':'1',
  'week-0':'', 'week-1':'', 'week-2':'', 'week-3':'', 'week-4':'', 'week-5':'', 'week-6':'',
  'days':'', 'main-time':'17:00',
  'fan-char':'/assets/nancho-bunny.png', 'hero-art':'',
  'rules':'욕설·과한 드립은 살짝만 접어두기\n타 방송·타 스트리머 이야기는 자제\n서로 초단끼리 예의는 지키기\n방송 내용 무단 편집·재업로드 금지',
  'link-soop':'https://www.sooplive.com/station/blackchu',
  'link-youtube':'https://www.youtube.com/@blackchu',
  'link-cafe':'https://cafe.naver.com/magicpanty',
  'link-melo':'https://meloming.com/channel/nancho',
  'link-x':''
};
function mergeP(raw){
  var p = {};
  Object.keys(PF_DEFAULT).forEach(function(k){ p[k] = PF_DEFAULT[k]; });
  Object.keys(raw || {}).forEach(function(k){
    var v = raw[k];
    if (v !== '' && v != null) p[k] = v;
  });
  return p;
}

function fillHooks(p){
  var els = document.querySelectorAll('[data-hook]');
  for (var i=0;i<els.length;i++){
    var k = els[i].getAttribute('data-hook');
    var v = txt(p[k]);
    if (v !== '') els[i].textContent = v;
  }
}

var _pf = null;
function getProfile(){
  if (_pf) return _pf;
  _pf = new Promise(function(res){
    if (typeof db === 'undefined' || !db){ res({}); return; }
    db.from('profile').select('data').eq('id',1).single()
      .then(function(r){ res((r && r.data && r.data.data) || {}); })
      .catch(function(){ res({}); });
  }).catch(function(){ return {}; });
  return _pf;
}

function avatarUrl(p){
  p = p || {};
  if (p.avatar) return p.avatar;
  var id = p['soop-id'] || NANCHO.soop;
  return 'https://profile.img.sooplive.co.kr/LOGO/' + id.slice(0,2) + '/' + id + '/' + id + '.jpg';
}

var TXT = null, _txtObs = null;
/* data-t is reserved for this text-override system.
   Use data-song / data-artist style names for per-page data. */
/* Broken content images (expired host links, deleted posts) must not show the
   browser's broken-image icon. Swap them for a placeholder tile that keeps the
   same box so the grid does not collapse. */
function markBroken(img){
  if (!img || img.dataset.broken) return;
  img.dataset.broken = '1';
  img.removeAttribute('src');
  img.classList.add('imgdead');
  img.alt = '';
  img.setAttribute('role', 'img');
  img.setAttribute('aria-label', '이미지를 불러올 수 없습니다');
}
document.addEventListener('error', function(e){
  var t = e.target;
  if (t && t.tagName === 'IMG' && !(t.closest && t.closest('#fxload'))) markBroken(t);
}, true);

function applyTexts(root){
  if (!TXT || !root) return;
  var list = [];
  if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute('data-t')) list.push(root);
  if (root.querySelectorAll){
    var q = root.querySelectorAll('[data-t]');
    for (var i=0;i<q.length;i++) list.push(q[i]);
  }
  for (var j=0;j<list.length;j++){
    var v = txt(TXT['txt-' + list[j].getAttribute('data-t')] || '');
    if (v && list[j].textContent !== v) list[j].textContent = v;
  }
}

function bindInquiry(){
  var mask = document.getElementById('askMask');
  if (!mask) return;
  document.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('[data-ask]')){ e.preventDefault(); mask.classList.add('on'); }
  });
  mask.addEventListener('click', function(e){
    if (e.target === mask || (e.target.closest && e.target.closest('[data-close]'))) mask.classList.remove('on');
  });
  
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') mask.classList.remove('on');
  });
  var btn = document.getElementById('askSend');
  if (btn) btn.addEventListener('click', function(){
    var nick = document.getElementById('askNick');
    var msg  = document.getElementById('askMsg');
    var v = (msg && msg.value || '').trim();
    if (!v){ toast('내용을 적어주세요'); return; }
    btn.disabled = true;
    Promise.resolve(typeof insertRow === 'function'
        ? insertRow('inquiries', { nickname: (nick && nick.value || '').trim() || null, message: v })
        : false)
      .then(function(ok){
        btn.disabled = false;
        if (ok){ msg.value=''; if(nick) nick.value=''; mask.classList.remove('on'); toast('전파 전송 완료 — 잘 받았어요'); }
        else toast('전송 실패 — 잠시 후 다시 시도해주세요');
      });
  });
}

function bindMenu(){
  var b = document.getElementById('moBtn'), m = document.getElementById('menu');
  if (b && m) b.addEventListener('click', function(){ m.classList.toggle('open'); });
}

function bootSite(){
  bindMenu();
  bindInquiry();
  var t = document.querySelectorAll('[data-mode]');
  for (var i=0;i<t.length;i++) t[i].addEventListener('click', toggleMode);
  applyMode(document.body.classList.contains('day') ? 'light' : 'dark');
  setTimeout(ready, 1400); // FOUC 폴백
  window.addEventListener('load', ready);
  
  getProfile().then(function(p){
    var av = document.querySelectorAll('[data-avatar]');
    for (var i=0;i<av.length;i++){
      var u = avatarUrl(p);
      if (av[i].tagName === 'IMG'){ av[i].src = u; av[i].referrerPolicy = 'no-referrer'; }
      else av[i].style.backgroundImage = 'url("' + u + '")';
    }
    var nm = txt(p['info-name']) || '난초';
    var n2 = document.querySelectorAll('[data-name]');
    for (var j=0;j<n2.length;j++) n2[j].textContent = nm;

    
    BG.night = txt(p['bg-night']); BG.day = txt(p['bg-day']);
    applyShot();

    
    var tg = txt(p['site-tagline']);
    if (tg){
      var te = document.querySelectorAll('[data-tagline]');
      for (var k=0;k<te.length;k++) te[k].textContent = tg;
    }

    
    TXT = p;
    applyTexts(document);
    if (window.MutationObserver && !_txtObs){
      _txtObs = new MutationObserver(function(muts){
        for (var mi=0; mi<muts.length; mi++){
          var ad = muts[mi].addedNodes;
          for (var ni=0; ni<ad.length; ni++){
            if (ad[ni].nodeType === 1) applyTexts(ad[ni]);
          }
        }
      });
      /* Needed for late-rendered nodes (modals, tabs). */
      _txtObs.observe(document.body, { childList:true, subtree:true });
    }

    
    var subs = document.querySelectorAll('[data-sub]');
    for (var m=0;m<subs.length;m++){
      var v = txt(p['sub-' + subs[m].getAttribute('data-sub')]);
      if (v) subs[m].textContent = v;
    }
    ready();
  });
}
