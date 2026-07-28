-- =============================================================
-- 난초 NANCHO / THE MIDNIGHT LOG — Supabase 전체 셋업 SQL (한 번에 붙여넣기용)
-- 사용법: Supabase → SQL Editor → 아래 전체 복붙 → Run.
-- ✅ 여러 번 다시 실행해도 안전 (CREATE ... IF NOT EXISTS / DROP POLICY IF EXISTS).
-- ✅ 모든 표는 anon(공개) 키로 읽기+쓰기 허용 — 관리자 페이지가 anon 키로 동작하므로 필수.
-- 안 쓰는 카테고리가 있어도 표는 그냥 둬도 무방(빈 표는 아무 영향 없음).
-- 이미지는 "링크" 방식이라 Storage(버킷) 없이도 동작합니다.
-- =============================================================


-- ── 프로필 (메인: id=1 한 칸에 JSON 저장) ──
CREATE TABLE IF NOT EXISTS profile (
  id         BIGINT PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profile_all" ON profile;
DROP POLICY IF EXISTS "profile_all" ON public.profile;
DROP POLICY IF EXISTS "profile_read" ON public.profile;
DROP POLICY IF EXISTS "profile_insert" ON public.profile;
DROP POLICY IF EXISTS "profile_update" ON public.profile;
DROP POLICY IF EXISTS "profile_delete" ON public.profile;
CREATE POLICY "profile_read"   ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile_insert" ON public.profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "profile_update" ON public.profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "profile_delete" ON public.profile FOR DELETE TO authenticated USING (true);


-- ── 공지 ──
CREATE TABLE IF NOT EXISTS notice (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  pinned     BOOLEAN DEFAULT FALSE,
  image_url  TEXT,
  images     JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notice ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE notice ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE notice ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notice_all" ON notice;
DROP POLICY IF EXISTS "notice_all" ON public.notice;
DROP POLICY IF EXISTS "notice_read" ON public.notice;
DROP POLICY IF EXISTS "notice_insert" ON public.notice;
DROP POLICY IF EXISTS "notice_update" ON public.notice;
DROP POLICY IF EXISTS "notice_delete" ON public.notice;
CREATE POLICY "notice_read"   ON public.notice FOR SELECT USING (true);
CREATE POLICY "notice_insert" ON public.notice FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notice_update" ON public.notice FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "notice_delete" ON public.notice FOR DELETE TO authenticated USING (true);


-- ── 일기 ──
CREATE TABLE IF NOT EXISTS diary (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  mood       TEXT,
  diary_date DATE,
  image_url  TEXT,
  images     JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE diary ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE diary ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE diary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "diary_all" ON diary;
DROP POLICY IF EXISTS "diary_all" ON public.diary;
DROP POLICY IF EXISTS "diary_read" ON public.diary;
DROP POLICY IF EXISTS "diary_insert" ON public.diary;
DROP POLICY IF EXISTS "diary_update" ON public.diary;
DROP POLICY IF EXISTS "diary_delete" ON public.diary;
CREATE POLICY "diary_read"   ON public.diary FOR SELECT USING (true);
CREATE POLICY "diary_insert" ON public.diary FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "diary_update" ON public.diary FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "diary_delete" ON public.diary FOR DELETE TO authenticated USING (true);


-- ── 일기 댓글 (일기 페이지에서 사용) ──
CREATE TABLE IF NOT EXISTS comments (
  id         BIGSERIAL PRIMARY KEY,
  diary_id   BIGINT NOT NULL,
  nickname   TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_all" ON comments;
DROP POLICY IF EXISTS "comments_all" ON public.comments;
DROP POLICY IF EXISTS "comments_read" ON public.comments;
DROP POLICY IF EXISTS "comments_insert" ON public.comments;
DROP POLICY IF EXISTS "comments_update" ON public.comments;
DROP POLICY IF EXISTS "comments_delete" ON public.comments;
-- 댓글: 팬이 남겨야 하므로 등록은 누구나, 수정·삭제는 관리자만
CREATE POLICY "comments_read"   ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_update" ON public.comments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE TO authenticated USING (true);


-- ── 일정 (달력) — 색/하이라이트/2부/설명 포함 ──
CREATE TABLE IF NOT EXISTS schedule (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  end_date    DATE,                          -- 비우면 하루짜리, 채우면 그 날까지 이어지는 '기간 일정'
  time        TEXT,
  type        TEXT DEFAULT '일반',          -- 일반 / 특별 / 콜라보 / 휴방
  note        TEXT,
  color       TEXT DEFAULT 'green',
  highlight   BOOLEAN DEFAULT FALSE,
  time2       TEXT,
  title2      TEXT,
  type2       TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 이전에 만든 프로젝트에도 기간 일정 컬럼을 안전하게 추가 (여러 번 실행해도 안전)
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS end_date DATE;

ALTER TABLE schedule ADD COLUMN IF NOT EXISTS color       TEXT DEFAULT 'green';
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS highlight   BOOLEAN DEFAULT FALSE;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS time2       TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS title2      TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS type2       TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schedule_all" ON schedule;
DROP POLICY IF EXISTS "schedule_all" ON public.schedule;
DROP POLICY IF EXISTS "schedule_read" ON public.schedule;
DROP POLICY IF EXISTS "schedule_insert" ON public.schedule;
DROP POLICY IF EXISTS "schedule_update" ON public.schedule;
DROP POLICY IF EXISTS "schedule_delete" ON public.schedule;
CREATE POLICY "schedule_read"   ON public.schedule FOR SELECT USING (true);
CREATE POLICY "schedule_insert" ON public.schedule FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "schedule_update" ON public.schedule FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "schedule_delete" ON public.schedule FOR DELETE TO authenticated USING (true);


-- ── 노래책: 커버곡 ──
CREATE TABLE IF NOT EXISTS songs (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  artist     TEXT,
  genre      TEXT DEFAULT '기타',
  difficulty INT  DEFAULT 3,
  memo       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "songs_all" ON songs;
DROP POLICY IF EXISTS "songs_all" ON public.songs;
DROP POLICY IF EXISTS "songs_read" ON public.songs;
DROP POLICY IF EXISTS "songs_insert" ON public.songs;
DROP POLICY IF EXISTS "songs_update" ON public.songs;
DROP POLICY IF EXISTS "songs_delete" ON public.songs;
CREATE POLICY "songs_read"   ON public.songs FOR SELECT USING (true);
CREATE POLICY "songs_insert" ON public.songs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "songs_update" ON public.songs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "songs_delete" ON public.songs FOR DELETE TO authenticated USING (true);


-- ── 노래책: 오리지널 곡 (SOOP VOD) ──
CREATE TABLE IF NOT EXISTS original_songs (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  vod_id     TEXT,
  thumbnail  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE original_songs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "original_songs_all" ON original_songs;
DROP POLICY IF EXISTS "original_songs_all" ON public.original_songs;
DROP POLICY IF EXISTS "original_songs_read" ON public.original_songs;
DROP POLICY IF EXISTS "original_songs_insert" ON public.original_songs;
DROP POLICY IF EXISTS "original_songs_update" ON public.original_songs;
DROP POLICY IF EXISTS "original_songs_delete" ON public.original_songs;
CREATE POLICY "original_songs_read"   ON public.original_songs FOR SELECT USING (true);
CREATE POLICY "original_songs_insert" ON public.original_songs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "original_songs_update" ON public.original_songs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "original_songs_delete" ON public.original_songs FOR DELETE TO authenticated USING (true);


-- ── 옷장 (헤어 / 렌즈 / 의상) — 이미지는 image_url(링크) ──
CREATE TABLE IF NOT EXISTS public.dress_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT NOT NULL DEFAULT 'hair',   -- hair / lens / outfit
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_key   TEXT DEFAULT '',                -- (안 씀) R2용 키
  image_url   TEXT DEFAULT '',                -- 이미지 링크(붙여넣은 주소)
  badges      JSONB DEFAULT '[]',             -- 예: [{"label":"NEW"}]
  is_event    BOOLEAN DEFAULT FALSE,
  glow_color  TEXT DEFAULT '',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dress_items_category ON public.dress_items(category);
ALTER TABLE public.dress_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dress_all" ON public.dress_items;
DROP POLICY IF EXISTS "dress_all" ON public.dress_items;
DROP POLICY IF EXISTS "dress_read" ON public.dress_items;
DROP POLICY IF EXISTS "dress_insert" ON public.dress_items;
DROP POLICY IF EXISTS "dress_update" ON public.dress_items;
DROP POLICY IF EXISTS "dress_delete" ON public.dress_items;
CREATE POLICY "dress_read"   ON public.dress_items FOR SELECT USING (true);
CREATE POLICY "dress_insert" ON public.dress_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "dress_update" ON public.dress_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "dress_delete" ON public.dress_items FOR DELETE TO authenticated USING (true);


-- ── 업보: 시청자 ──
CREATE TABLE IF NOT EXISTS viewers (
  id         BIGSERIAL PRIMARY KEY,
  nickname   TEXT NOT NULL,
  soop_id    TEXT,
  memo       TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE viewers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "viewers_all" ON viewers;
DROP POLICY IF EXISTS "viewers_all" ON public.viewers;
DROP POLICY IF EXISTS "viewers_read" ON public.viewers;
DROP POLICY IF EXISTS "viewers_insert" ON public.viewers;
DROP POLICY IF EXISTS "viewers_update" ON public.viewers;
DROP POLICY IF EXISTS "viewers_delete" ON public.viewers;
CREATE POLICY "viewers_read"   ON public.viewers FOR SELECT USING (true);
CREATE POLICY "viewers_insert" ON public.viewers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "viewers_update" ON public.viewers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "viewers_delete" ON public.viewers FOR DELETE TO authenticated USING (true);


-- ── 업보: 타입(종류) ──
CREATE TABLE IF NOT EXISTS upbo_types (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT DEFAULT '일반',            -- 일반 / 이벤트
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE upbo_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "upbo_types_all" ON upbo_types;
DROP POLICY IF EXISTS "upbo_types_all" ON public.upbo_types;
DROP POLICY IF EXISTS "upbo_types_read" ON public.upbo_types;
DROP POLICY IF EXISTS "upbo_types_insert" ON public.upbo_types;
DROP POLICY IF EXISTS "upbo_types_update" ON public.upbo_types;
DROP POLICY IF EXISTS "upbo_types_delete" ON public.upbo_types;
CREATE POLICY "upbo_types_read"   ON public.upbo_types FOR SELECT USING (true);
CREATE POLICY "upbo_types_insert" ON public.upbo_types FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "upbo_types_update" ON public.upbo_types FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "upbo_types_delete" ON public.upbo_types FOR DELETE TO authenticated USING (true);


-- ── 업보: 카운트 (시청자 × 타입 = 횟수) ──
CREATE TABLE IF NOT EXISTS upbo_counts (
  id         BIGSERIAL PRIMARY KEY,
  viewer_id  BIGINT NOT NULL,
  type_id    BIGINT NOT NULL,
  count      INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (viewer_id, type_id)
);
ALTER TABLE upbo_counts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "upbo_counts_all" ON upbo_counts;
DROP POLICY IF EXISTS "upbo_counts_all" ON public.upbo_counts;
DROP POLICY IF EXISTS "upbo_counts_read" ON public.upbo_counts;
DROP POLICY IF EXISTS "upbo_counts_insert" ON public.upbo_counts;
DROP POLICY IF EXISTS "upbo_counts_update" ON public.upbo_counts;
DROP POLICY IF EXISTS "upbo_counts_delete" ON public.upbo_counts;
CREATE POLICY "upbo_counts_read"   ON public.upbo_counts FOR SELECT USING (true);
CREATE POLICY "upbo_counts_insert" ON public.upbo_counts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "upbo_counts_update" ON public.upbo_counts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "upbo_counts_delete" ON public.upbo_counts FOR DELETE TO authenticated USING (true);


-- ── 문의함 ──
CREATE TABLE IF NOT EXISTS inquiries (
  id         BIGSERIAL PRIMARY KEY,
  nickname   TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inquiries_all" ON inquiries;
DROP POLICY IF EXISTS "inquiries_all" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_read" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_insert" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_update" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_delete" ON public.inquiries;
-- 문의: 누구나 보낼 수 있고, 읽는 건 로그인한 관리자만 (개인정보)
CREATE POLICY "inquiries_read"   ON public.inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "inquiries_insert" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "inquiries_delete" ON public.inquiries FOR DELETE TO authenticated USING (true);


-- ── (옷장 OBS 오버레이 쓸 때만) "지금 트는 노래" 상태 1행 ──
CREATE TABLE IF NOT EXISTS public.overlay_state (
  id          INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  song_title  TEXT DEFAULT '',
  song_artist TEXT DEFAULT '',
  is_visible  BOOLEAN DEFAULT FALSE,          -- ⚠️ OBS에 보이려면 true
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.overlay_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
ALTER TABLE public.overlay_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "overlay_all" ON public.overlay_state;
DROP POLICY IF EXISTS "overlay_all" ON public.overlay_state;
DROP POLICY IF EXISTS "overlay_read" ON public.overlay_state;
DROP POLICY IF EXISTS "overlay_insert" ON public.overlay_state;
DROP POLICY IF EXISTS "overlay_update" ON public.overlay_state;
DROP POLICY IF EXISTS "overlay_delete" ON public.overlay_state;
CREATE POLICY "overlay_read"   ON public.overlay_state FOR SELECT USING (true);
CREATE POLICY "overlay_insert" ON public.overlay_state FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "overlay_update" ON public.overlay_state FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "overlay_delete" ON public.overlay_state FOR DELETE TO authenticated USING (true);


-- ── 프로필 기본 행(id=1) 보장 ──
-- ⚠️ 한 Supabase 프로젝트는 "한 사람"에게만 쓰세요.
--    이미 다른 사람 데이터가 들어있는 프로젝트를 재사용하면, 아래 INSERT는
--    DO NOTHING 때문에 옛 데이터를 덮어쓰지 않습니다(= 프사·이름이 옛 사람으로 보임).
--    새 사람으로 갈아끼울 땐, 아래 줄의 맨 앞 '--' 를 지워서 한 번 실행하면 프로필이 비워집니다.
-- DELETE FROM profile WHERE id = 1;
INSERT INTO profile (id, data) VALUES (1, '{"avatar": "", "soop-id": "blackchu", "info-name": "난초", "info-reading": "NANCHO", "info-catchphrase": "밤하늘 속에 피어난", "info-debut": "2018-11-22", "info-birth": "12월 16일", "info-fandom": "초단", "info-agency": "패러블", "info-gender": "여", "info-mbti": "", "info-content": "게임 / 저챗 / 노래 / 싱크룸", "info-time": "오후 5시 전후", "info-game": "마인크래프트, 배틀그라운드", "info-song": "KPOP 위주 · 정기적으로 부름", "info-tags": "개구쟁이, 밝음, 짱구, 별, 달, 밤하늘", "quote": "우우우~ 예쁜누나다 / 와따! / 웨우~!", "msg": "밤이 깊어질수록 선명해지는 주파수.\n게임하고, 떠들고, 노래하고 — 자정 언저리에 제일 잘 잡혀요.\n초단이면 누구든 환영, 조용히 듣기만 해도 좋아요.", "now": "", "like-list": "초단\n초코맛\n초코비\n미쯔\n하겐다즈", "dislike-list": "벌레", "stats": "텐션:92\n개구쟁이:97\n노래:85\n게임:80\n집중력:63", "milestones": "2018.11.22|첫 송출 — 전파 개통\n진행중|초단들과 밤마다 주파수 맞추는 중", "tmi-food": "초코비 · 하겐다즈", "tmi-song": "헤비 Be I / 첫 키스에 내 심장은 120BPM", "tmi-game": "마인크래프트, 배틀그라운드", "tmi-book": "", "days": "", "main-time": "17:00", "fan-char": "", "hero-art": "", "rules": "욕설·과한 드립은 살짝만 접어두기\n타 방송·타 스트리머 이야기는 자제\n서로 초단끼리 예의는 지키기\n방송 내용 무단 편집·재업로드 금지", "link-soop": "https://www.sooplive.com/station/blackchu", "link-youtube": "https://www.youtube.com/@blackchu", "link-cafe": "https://cafe.naver.com/magicpanty", "link-melo": "https://meloming.com/channel/nancho", "link-x": "", "theme-main": "#C79BD8", "theme-main-light": "#E4CDF0", "theme-main-dark": "#9D77A6", "theme-main-deep": "#50315D", "theme-bg": "#09070D", "theme-logo": "#F3EAFA", "main-photo": "", "bg-night": "", "bg-day": "", "site-tagline": "THE MIDNIGHT LOG · 자정의 기록실", "main-story": "게임과 이야기 사이, 밤의 주파수를 맞춰요.", "info-motif": "별 · 달 · 밤하늘 / 팬캐릭터 토끼", "fandom-note": "난초를 듣는 사람들", "sub-profile": "밤하늘 속에 피어난 사람. 난초라는 주파수를 이루는 모든 항목을 한 장에 적어둔 기록실.", "sub-notice": "전파를 타기 전에 먼저 알려두는 것들. 고정 공지가 맨 위에 걸립니다.", "sub-schedule": "이번 달 전파 편성표. 색은 방송 종류, 굵게 표시된 칸은 놓치면 아쉬운 날.", "sub-work": "방송에서 쌓인 것들은 사라지지 않고 장부에 남습니다. 오늘도 성실히 적립 중.", "sub-diary": "방송이 끝나고 남는 이야기들. 짧아도 길어도, 그날의 주파수를 그대로 적어둡니다.", "sub-song": "KPOP 위주로 쌓아둔 목록. 곡을 누르면 신청하기 좋게 복사되고, 랜덤 선곡도 됩니다.", "sub-dress": "난초가 걸쳤던 것들을 한 장의 컨택트 시트로. 분류를 눌러 걸러 보고, 컷을 눌러 크게 봅니다.", "sub-game": "방송이 끝난 뒤에도 불이 꺼지지 않는 구역. 사다리로 벌칙을 정하고, 룰렛으로 당첨자를 뽑습니다.", "week-0": "", "week-1": "", "week-2": "", "week-3": "", "week-4": "", "week-5": "", "week-6": "", "type-display": "1", "type-title": "1", "type-body": "1", "type-label": "1", "txt-t-profile-1": "", "txt-t-profile-2": "", "txt-t-profile-3": "", "txt-t-profile-4": "", "txt-t-profile-5": "", "txt-t-profile-6": "", "txt-t-profile-7": "", "txt-t-profile-8": "", "txt-t-profile-9": "", "txt-t-profile-10": "", "txt-t-notice-1": "", "txt-t-schedule-1": "", "txt-t-schedule-2": "", "txt-t-work-1": "", "txt-t-diary-1": "", "txt-t-song-1": "", "txt-t-song-2": "", "txt-t-song-3": "", "txt-t-dress-1": "", "txt-t-game-1": "", "txt-t-game-2": "", "txt-t-game-3": "", "txt-t-game-4": "", "txt-t-index-1": "", "txt-t-profile-11": "", "txt-t-profile-12": "", "txt-t-profile-13": "", "txt-t-profile-14": "", "txt-t-profile-15": "", "txt-t-profile-16": "", "txt-t-profile-17": "", "txt-t-profile-18": "", "txt-t-profile-19": "", "txt-t-profile-20": "", "txt-t-profile-21": "", "txt-t-profile-22": "", "txt-t-profile-23": "", "txt-t-profile-24": "", "txt-t-profile-25": "", "txt-t-profile-26": "", "txt-t-profile-27": "", "txt-t-profile-28": "", "txt-t-profile-29": "", "txt-t-profile-30": "", "txt-t-profile-31": "", "txt-t-schedule-3": "", "txt-t-schedule-4": "", "txt-t-schedule-5": "", "txt-t-diary-2": "", "txt-t-song-4": "", "txt-t-game-5": "", "txt-t-game-6": "", "txt-t-game-7": "", "txt-t-game-8": "", "txt-nav-1": "", "txt-nav-2": "", "txt-nav-3": "", "txt-nav-4": "", "txt-nav-5": "", "txt-nav-6": "", "txt-nav-7": "", "txt-nav-8": "", "txt-nav-9": ""}'::jsonb) ON CONFLICT (id) DO NOTHING;

-- 끝! 이미지는 전부 "링크" 방식이라 Storage 설정이 필요 없습니다.


-- ─────────────────────────────────────────────
-- 옷장 분류 참고 (dress_items.category)
--   hair = 헤어 / outfit = 의상 / lens = 렌즈 / event = 이벤트
-- 페이지·관리자 세 곳이 이 값을 씁니다.
-- ─────────────────────────────────────────────

-- ── 업보 종류 예시(원하면 그대로 Run, 필요 없으면 지우세요) ──
INSERT INTO upbo_types (name, category, sort_order)
SELECT v.name, v.cat, v.ord FROM (VALUES
  ('지각', '일반', 1),
  ('막말', '일반', 2),
  ('트롤', '일반', 3),
  ('약속 파기', '일반', 4)
) AS v(name, cat, ord)
WHERE NOT EXISTS (SELECT 1 FROM upbo_types);
