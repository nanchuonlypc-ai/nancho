

const SUPABASE_URL  = 'https://wtwibpchtbjwiuvzaybh.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0d2licGNodGJqd2l1dnpheWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMjk1NDQsImV4cCI6MjEwMDYwNTU0NH0.f8GJFmOuR61Jt7bZJL3lr1rhUeVIsEcCUZj4dC3sRpM';

var db = null;
try {
  if (typeof supabase !== 'undefined' && SUPABASE_URL.indexOf('{{') < 0) {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  } else {
    console.warn('[supabase.js] 아직 Supabase 주소/키가 설정되지 않았습니다 — 기본값으로 표시합니다.');
  }
} catch (e) {
  console.warn('[supabase.js] 초기화 실패:', e);
}
function dbReady(){ return !!db; }

async function fetchAll(table, options = {}) {
  if (!db) return [];
  let query = db.from(table).select('*');
  if (options.order)  query = query.order(options.order, { ascending: options.asc ?? false });
  if (options.limit)  query = query.limit(options.limit);
  if (options.filter) query = query.eq(options.filter.col, options.filter.val);
  const { data, error } = await query;
  if (error) { console.error(`fetchAll(${table}) 오류:`, error); return []; }
  return data;
}

async function insertRow(table, row) {
  if (!db) return false;
  const { error } = await db.from(table).insert(row);
  if (error) { console.error(`insertRow(${table}) 오류:`, error); return false; }
  return true;
}

async function deleteRow(table, id) {
  if (!db) return false;
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) { console.error(`deleteRow(${table}) 오류:`, error); return false; }
  return true;
}

async function updateRow(table, id, updates) {
  if (!db) return false;
  const { error } = await db.from(table).update(updates).eq('id', id);
  if (error) { console.error(`updateRow(${table}) 오류:`, error); return false; }
  return true;
}

async function compressImage(file, maxW = 1200, quality = 0.8) {
  if (file.type === 'image/gif') return file;
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    return blob || file;
  } catch (e) {
    console.error('compressImage 오류:', e);
    return file; // 실패 시 원본 그대로
  }
}

async function uploadImage(file, folder = 'uploads') {
  try {
    const blob = await compressImage(file);
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${folder}/${Date.now()}_${rand}.jpg`;
    const { error } = await db.storage.from('nancho').upload(path, blob, {
      upsert: true, contentType: 'image/jpeg'
    });
    if (error) { console.error('uploadImage 오류:', error); return null; }
    const { data } = db.storage.from('nancho').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    console.error('uploadImage 예외:', e);
    return null;
  }
}

function showToast(msg, duration = 2500) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function initIframeResize() {
  const send = () =>
    window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
  send();
  new ResizeObserver(send).observe(document.body);
}

function enableIframeAutoHeight() { initIframeResize(); }

async function applyTheme(){
  if (!db) return;
  try{
    const { data } = await db.from('profile').select('data').eq('id',1).single();
    const p = (data && data.data) || {};
    const map = {
      'theme-main':      '--main',
      'theme-main-dark': '--main-dark',
      'theme-main-deep': '--main-deep',
      'theme-main-light':'--main-light',
      'theme-bg':        '--bg',
      'theme-logo':      '--logo',
      
      'type-display':    '--fs-display',
      'type-title':      '--fs-title',
      'type-body':       '--fs-body',
      'type-label':      '--fs-label'
    };
    Object.keys(map).forEach(function(k){
      if(p[k]) document.documentElement.style.setProperty(map[k], p[k]);
    });
  }catch(e){  }
}
applyTheme();
