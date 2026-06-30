import { useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  BookOpen,
  Clipboard,
  Flame,
  Grid3X3,
  Magnet,
  RefreshCcw,
  RotateCcw,
  Save,
  Scissors,
  Shuffle,
  Sparkles,
  Type,
  Wand2
} from "lucide-react";

const WASHED_COLORS = ["#ffc9c9", "#ffe3b3", "#fff3b5", "#d4f0d4", "#c9ebff", "#d9cbf2", "#ffcbf2"];
const assetPath = (file) => `${import.meta.env.BASE_URL}${file}`;
const DEFAULT_NOUNS = [
  "거울",
  "파편",
  "심연",
  "공백",
  "기억",
  "망각",
  "미학",
  "구토",
  "이방인",
  "페스트",
  "시시포스",
  "환영",
  "균열",
  "기하학",
  "태엽",
  "미궁",
  "내장",
  "잿더미",
  "권태",
  "맹목"
];

const HISTORY = {
  oulipo: {
    label: "Oulipo",
    title: "S+N 치환",
    image: assetPath("queneau.jpg"),
    text: "레몽 크노와 장 레스퀴르가 고안한 울리포식 제약 글쓰기입니다. 명사를 사전의 N번째 뒤 단어로 밀어내며, 의도보다 규칙이 먼저 움직이게 합니다."
  },
  dissect: {
    label: "Dissector",
    title: "컷업 마그넷",
    image: assetPath("burroughs.jpg"),
    text: "트리스탄 차라와 윌리엄 버로스의 컷업 기법을 브라우저 위의 종이 조각으로 바꿨습니다. 단어를 움직이고 자르고 붙여 우연한 배열을 만듭니다."
  },
  automaton: {
    label: "Automaton",
    title: "자동 기술",
    image: assetPath("breton.jpg"),
    text: "앙드레 브르통의 자동 기술법처럼 멈추지 않고 쓰는 도구입니다. 오래 멈추면 최근 문장이 사라지고, 수정은 일부러 버겁게 느껴집니다."
  },
  erasure: {
    label: "Erasure",
    title: "소거시",
    image: assetPath("duchamp.jpg"),
    text: "이미 있는 문장을 지워 남은 파편으로 새 시를 만드는 방식입니다. 클릭하거나 드래그해 단어를 검게 덮습니다."
  },
  corpse: {
    label: "Cadavre",
    title: "우아한 시체",
    image: assetPath("dali.jpg"),
    text: "앞 문장의 끝 일부만 보고 이어 쓰는 초현실주의 집단 놀이입니다. 문맥은 접히고, 마지막 세 어절만 다음 사람에게 남습니다."
  },
  babel: {
    label: "Babel",
    title: "바벨 글리치",
    image: assetPath("hausmann.jpg"),
    text: "다다이즘의 활자 콜라주처럼 문장을 일부러 오역하고 흔듭니다. 의미를 전달하는 문장이 이미지처럼 흐트러집니다."
  },
  roussel: {
    label: "Roussel",
    title: "루셀의 다리",
    image: assetPath("roussel.jpg"),
    text: "비슷한 소리의 두 문장을 양끝에 두고 그 사이의 불가능한 서사를 쓰는 레몽 루셀식 절차입니다."
  },
  disparition: {
    label: "La Disparition",
    title: "립포그램",
    image: assetPath("perec.jpg"),
    text: "조르주 페렉의 『실종』처럼 금지된 글자와 단어를 피해 글을 씁니다. 금지를 밟는 순간 문장은 되돌아갑니다."
  }
};

const TABS = [
  ["oulipo", Sparkles],
  ["dissect", Scissors],
  ["automaton", Flame],
  ["erasure", Ban],
  ["corpse", Clipboard],
  ["babel", Type],
  ["roussel", BookOpen],
  ["disparition", Grid3X3]
];

const SURREAL_NOUNS = ["침묵", "기하학", "고깃덩어리", "균열", "환상지", "잔해", "태엽", "미궁", "백색소음", "이물질", "심연", "파편", "얼룩", "구토"];
const WEIRD_ADVERBS = ["기계적으로", "불쾌하게", "영원히", "느닷없이", "집요하게", "증발하듯", "조각조각", "발작적으로"];
const WEIRD_PARTICLES = ["에게로써", "마저도", "조차", "의 곁에서", "를 향한", "치고는", "너머로"];
const WEIRD_ENDINGS = ["었도다", "리라", "느냐", "거늘", "ㄹ지언정", "나이다", "겠지", "련만"];
const GLITCH_MARKS = ["... ", " [데이터 누락] ", " / ", " (침묵) ", " ░▒▓ ", " // "];
const CHO_LIST = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"];
const JUNG_LIST = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ", "ㅐ", "ㅒ", "ㅔ", "ㅖ", "ㅘ", "ㅙ", "ㅚ", "ㅝ", "ㅞ", "ㅟ", "ㅢ"];
const JONG_LIST = ["", "ㄱ", "ㄲ", "ㄱㅅ", "ㄴ", "ㄴㅈ", "ㄴㅎ", "ㄷ", "ㄹ", "ㄹㄱ", "ㄹㅁ", "ㄹㅂ", "ㄹㅅ", "ㄹㅌ", "ㄹㅍ", "ㄹㅎ", "ㅁ", "ㅂ", "ㅂㅅ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JONG_MAP = { "ㄱㅅ": ["ㄱ", "ㅅ"], "ㄴㅈ": ["ㄴ", "ㅈ"], "ㄴㅎ": ["ㄴ", "ㅎ"], "ㄹㄱ": ["ㄹ", "ㄱ"], "ㄹㅁ": ["ㄹ", "ㅁ"], "ㄹㅂ": ["ㄹ", "ㅂ"], "ㄹㅅ": ["ㄹ", "ㅅ"], "ㄹㅌ": ["ㄹ", "ㅌ"], "ㄹㅍ": ["ㄹ", "ㅍ"], "ㄹㅎ": ["ㄹ", "ㅎ"], "ㅂㅅ": ["ㅂ", "ㅅ"] };

const uid = () => Math.random().toString(36).slice(2, 10);
const sample = (items) => items[Math.floor(Math.random() * items.length)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const splitWords = (text) => text.trim().split(/\s+/).filter(Boolean);

function App() {
  const [activeTab, setActiveTab] = useState("oulipo");
  const [nouns, setNouns] = useState(DEFAULT_NOUNS);
  const [savedAt, setSavedAt] = useState("");
  const [state, setState] = useLocalState("jerboa-oulipo-save-v2", initialState);

  useEffect(() => {
    fetch(assetPath("nouns.txt"))
      .then((res) => (res.ok ? res.text() : ""))
      .then((text) => {
        const loaded = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        if (loaded.length) setNouns(loaded);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSavedAt(new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
  }, [state]);

  const patch = (key, value) => setState((prev) => ({ ...prev, [key]: typeof value === "function" ? value(prev[key]) : value }));
  const Active = {
    oulipo: <Oulipo state={state} patch={patch} nouns={nouns} />,
    dissect: <Dissector state={state} patch={patch} />,
    automaton: <Automaton state={state} patch={patch} />,
    erasure: <Erasure state={state} patch={patch} />,
    corpse: <Corpse state={state} patch={patch} />,
    babel: <Babel state={state} patch={patch} />,
    roussel: <Roussel state={state} patch={patch} nouns={nouns} />,
    disparition: <Disparition state={state} patch={patch} />
  }[activeTab];

  return (
    <div className="app-shell">
      <aside className="side">
        <div className="brand">
          <span className="brand-mark">J</span>
          <div>
            <h1>Jerboa Oulipo</h1>
            <p>Surrealist Workshop</p>
          </div>
        </div>
        <nav className="tab-list" aria-label="작업실">
          {TABS.map(([key, Icon]) => (
            <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)}>
              <Icon size={18} />
              <span>{HISTORY[key].label}</span>
            </button>
          ))}
        </nav>
        <div className="save-panel">
          <Save size={17} />
          <span>자동 저장됨 {savedAt}</span>
        </div>
      </aside>

      <main className="workspace">
        <HistoryCard item={HISTORY[activeTab]} />
        {Active}
        <FragmentCloud nouns={nouns} />
      </main>
    </div>
  );
}

function initialState() {
  return {
    oulipoInput: "나는 <심연을> 보았다.",
    oulipoShift: 7,
    oulipoProbability: 100,
    oulipoBump: 16,
    oulipoTilt: 10,
    oulipoOutput: "",
    dissectInput: "캔버스에 뿌릴 시를 입력하세요",
    magnets: [],
    automatonText: "",
    erasureInput: "이성은 언제나 우리를 배신한다. 논리는 껍데기에 불과하며, 진정한 구원은 무의식의 심연 속에서 헤엄치는 파편화된 이미지들에 있다.",
    erasedWords: [],
    corpseLines: [],
    babelInput: "나는 오늘 아침에 일어나 거울을 보며 깊은 절망을 느꼈다.",
    babelOutput: "",
    babelBump: 30,
    babelTilt: 15,
    rousselStep: 1,
    rousselInitial: "",
    rousselBase: "",
    rousselWords: [],
    rousselSelected: "",
    rousselBody: "",
    rousselPinned: [],
    forbiddenWords: [],
    forbiddenLetters: [],
    disparitionText: "",
    disparitionWriting: false,
    violation: ""
  };
}

function useLocalState(key, createInitial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? { ...createInitial(), ...JSON.parse(stored) } : createInitial();
    } catch {
      return createInitial();
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function HistoryCard({ item }) {
  return (
    <section className="history-card">
      <img src={item.image} alt="" />
      <div>
        <p className="eyebrow">{item.label}</p>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
      </div>
    </section>
  );
}

function Panel({ title, children, actions }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {actions && <div className="actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function Oulipo({ state, patch, nouns }) {
  const run = () => {
    const output = transformOulipo(state.oulipoInput, nouns, Number(state.oulipoShift), Number(state.oulipoProbability));
    patch("oulipoOutput", output);
  };

  return (
    <Panel
      title="울리포 엔진"
      actions={
        <button className="primary" onClick={run}>
          <Wand2 size={17} /> 문장 재단
        </button>
      }
    >
      <textarea value={state.oulipoInput} onChange={(e) => patch("oulipoInput", e.target.value)} rows={5} placeholder="문장을 입력하세요. <단어>는 보호됩니다." />
      <div className="control-grid">
        <Range label={`S+N 거리 ${state.oulipoShift}`} min="1" max="100" value={state.oulipoShift} onChange={(v) => patch("oulipoShift", v)} />
        <Range label={`변환 확률 ${state.oulipoProbability}%`} min="0" max="100" value={state.oulipoProbability} onChange={(v) => patch("oulipoProbability", v)} />
        <Range label={`진동 ${state.oulipoBump}`} min="0" max="60" value={state.oulipoBump} onChange={(v) => patch("oulipoBump", v)} />
        <Range label={`비틀림 ${state.oulipoTilt}°`} min="0" max="30" value={state.oulipoTilt} onChange={(v) => patch("oulipoTilt", v)} />
      </div>
      <JitterText text={state.oulipoOutput || "결과가 여기에 나타납니다."} bump={state.oulipoBump / 100} tilt={state.oulipoTilt} />
    </Panel>
  );
}

function transformOulipo(text, nouns, shift, probability) {
  const dict = nouns.length ? nouns : DEFAULT_NOUNS;
  return text
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith("<") && part.endsWith(">")) return part.slice(1, -1);
      return part.replace(/[가-힣A-Za-z0-9_]+/g, (word) => {
        if (Math.random() * 100 > probability) return word;
        const found = dict.indexOf(word);
        if (found >= 0) return dict[(found + shift) % dict.length];
        if (/[가-힣]{2,}/.test(word) && Math.random() < probability / 180) return sample(dict);
        return word;
      });
    })
    .join("");
}

function JitterText({ text, bump, tilt }) {
  const spans = useMemo(
    () =>
      [...text].map((char, index) => ({
        char,
        size: 1.25 + (Math.random() * 2 - 1) * bump,
        rot: (Math.random() * 2 - 1) * tilt,
        key: `${char}-${index}-${Math.random()}`
      })),
    [text, bump, tilt]
  );
  return (
    <div className="jitter-output">
      {spans.map((span) =>
        span.char === "\n" ? (
          <br key={span.key} />
        ) : (
          <span key={span.key} style={{ fontSize: `${span.size}rem`, transform: `rotate(${span.rot}deg)` }}>
            {span.char === " " ? "\u00a0" : span.char}
          </span>
        )
      )}
    </div>
  );
}

function Dissector({ state, patch }) {
  const [tool, setTool] = useState("move");
  const [selected, setSelected] = useState(null);
  const drag = useRef(null);

  const create = () => {
    const words = splitWords(state.dissectInput);
    patch(
      "magnets",
      words.map((word, index) => ({
        id: uid(),
        text: word,
        colors: [...word].map(() => sample(WASHED_COLORS)),
        x: 24 + (index % 4) * 120 + Math.random() * 30,
        y: 28 + Math.floor(index / 4) * 68 + Math.random() * 20
      }))
    );
  };

  const updateMagnet = (id, fn) => patch("magnets", (items) => items.map((item) => (item.id === id ? fn(item) : item)));
  const removeMagnet = (id) => patch("magnets", (items) => items.filter((item) => item.id !== id));
  const addMagnet = (magnet) => patch("magnets", (items) => [...items, magnet]);

  const splitMagnet = (magnet, index) => {
    if (index < 1) return;
    removeMagnet(magnet.id);
    addMagnet({ id: uid(), text: magnet.text.slice(0, index), colors: magnet.colors.slice(0, index), x: magnet.x, y: magnet.y });
    addMagnet({ id: uid(), text: magnet.text.slice(index), colors: magnet.colors.slice(index), x: magnet.x + 40, y: magnet.y + 24 });
  };

  const glue = (magnet) => {
    if (!selected) {
      setSelected(magnet.id);
      return;
    }
    const first = state.magnets.find((item) => item.id === selected);
    if (!first || first.id === magnet.id) {
      setSelected(null);
      return;
    }
    patch("magnets", (items) =>
      items
        .filter((item) => item.id !== first.id && item.id !== magnet.id)
        .concat({
          id: uid(),
          text: first.x <= magnet.x ? first.text + magnet.text : magnet.text + first.text,
          colors: first.x <= magnet.x ? first.colors.concat(magnet.colors) : magnet.colors.concat(first.colors),
          x: Math.min(first.x, magnet.x),
          y: Math.min(first.y, magnet.y)
        })
    );
    setSelected(null);
  };

  const shuffle = () => {
    const shuffled = [...state.magnets].sort(() => Math.random() - 0.5);
    patch(
      "magnets",
      shuffled.map((magnet, index) => ({
        ...magnet,
        x: 24 + (index % 5) * 135 + Math.random() * 24,
        y: 30 + Math.floor(index / 5) * 76 + Math.random() * 16
      }))
    );
  };

  return (
    <Panel
      title="마그넷 해부대"
      actions={
        <>
          <button className={tool === "knife" ? "danger" : ""} onClick={() => setTool(tool === "knife" ? "move" : "knife")}>
            <Scissors size={17} /> 칼
          </button>
          <button className={tool === "glue" ? "blue" : ""} onClick={() => setTool(tool === "glue" ? "move" : "glue")}>
            <Magnet size={17} /> 풀
          </button>
          <button onClick={shuffle}>
            <Shuffle size={17} /> 셔플
          </button>
        </>
      }
    >
      <textarea value={state.dissectInput} onChange={(e) => patch("dissectInput", e.target.value)} rows={3} />
      <button className="primary wide" onClick={create}>
        <Magnet size={17} /> 캔버스에 마그넷 생성
      </button>
      <div
        className={`magnet-board ${tool}`}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const { id, dx, dy } = drag.current;
          updateMagnet(id, (item) => ({ ...item, x: e.clientX - dx, y: e.clientY - dy }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        {state.magnets.map((magnet) => (
          <div
            key={magnet.id}
            className={`magnet ${selected === magnet.id ? "selected" : ""}`}
            style={{ left: magnet.x, top: magnet.y }}
            onPointerDown={(e) => {
              if (tool === "glue") {
                glue(magnet);
                return;
              }
              if (tool === "move") {
                drag.current = { id: magnet.id, dx: e.clientX - magnet.x, dy: e.clientY - magnet.y };
              }
            }}
          >
            {[...magnet.text].map((char, index) => (
              <span key={`${magnet.id}-${index}`} style={{ backgroundColor: magnet.colors[index] }} onPointerDown={(e) => tool === "knife" && (e.stopPropagation(), splitMagnet(magnet, index))}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Automaton({ state, patch }) {
  const [progress, setProgress] = useState(100);
  const [warning, setWarning] = useState("");
  const timer = useRef(null);
  const backspaces = useRef(0);
  const required = useRef(3);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    clearInterval(timer.current);
    let left = 5000;
    setProgress(100);
    timer.current = setInterval(() => {
      if (!state.automatonText.trim()) return;
      left -= 100;
      setProgress((left / 5000) * 100);
      if (left <= 0) {
        clearInterval(timer.current);
        const words = splitWords(state.automatonText);
        const keep = words.slice(0, Math.max(0, words.length - (3 + Math.floor(Math.random() * 3)))).join(" ");
        patch("automatonText", keep ? `${keep} ` : "");
        setWarning("최근 파편이 증발했습니다.");
        setTimeout(() => setWarning(""), 1200);
        setProgress(100);
      }
    }, 100);
  };

  return (
    <Panel title="자동 기술 에디터">
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      <textarea
        className="large-editor"
        value={state.automatonText}
        onChange={(e) => {
          patch("automatonText", e.target.value);
          start();
        }}
        onKeyDown={(e) => {
          if (e.key !== "Backspace") return;
          backspaces.current += 1;
          setWarning("이성이 저항합니다. 더 세게 누르세요.");
          if (backspaces.current < required.current) e.preventDefault();
          else {
            backspaces.current = 0;
            required.current = 3 + Math.floor(Math.random() * 3);
          }
        }}
        rows={12}
        placeholder="멈추지 말고 쓰세요. 5초간 멈추면 최근 어절이 사라집니다."
      />
      {warning && <p className="warning">{warning}</p>}
    </Panel>
  );
}

function Erasure({ state, patch }) {
  const words = useMemo(() => splitWords(state.erasureInput), [state.erasureInput]);
  const toggle = (index) => patch("erasedWords", (items) => (items.includes(index) ? items.filter((item) => item !== index) : [...items, index]));
  const erase = (index) => patch("erasedWords", (items) => (items.includes(index) ? items : [...items, index]));
  const dragging = useRef(false);

  return (
    <Panel title="블랙아웃 캔버스" actions={<button onClick={() => patch("erasedWords", [])}><RotateCcw size={17} /> 복원</button>}>
      <textarea value={state.erasureInput} onChange={(e) => patch("erasureInput", e.target.value)} rows={4} />
      <div className="erasure-board" onPointerDown={() => (dragging.current = true)} onPointerUp={() => (dragging.current = false)} onPointerLeave={() => (dragging.current = false)}>
        {words.map((word, index) => (
          <button key={`${word}-${index}`} className={state.erasedWords.includes(index) ? "erased" : ""} onPointerDown={() => toggle(index)} onPointerEnter={() => dragging.current && erase(index)}>
            {word}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function Corpse({ state, patch }) {
  const [line, setLine] = useState("");
  const last = state.corpseLines.at(-1);
  const hint = last ? splitWords(last).slice(-3).join(" ") : "첫 문장을 입력해 의식을 시작하세요.";

  return (
    <Panel
      title="우아한 시체"
      actions={<button className="danger" onClick={() => patch("corpseLines", [])}><RotateCcw size={17} /> 초기화</button>}
    >
      <div className="corpse-hint">{last ? `... ${hint}` : hint}</div>
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!line.trim()) return;
          patch("corpseLines", (items) => [...items, line.trim()]);
          setLine("");
        }}
      >
        <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="다음 문장 이어쓰기" />
        <button className="primary">종이 접기</button>
      </form>
      <div className="poem">
        {state.corpseLines.length ? state.corpseLines.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p>아직 작성된 문장이 없습니다.</p>}
      </div>
    </Panel>
  );
}

function Babel({ state, patch }) {
  const run = () => {
    const chunks = state.babelInput.split(/(\s+|[.,!?])/).map((part) => {
      if (!part.trim()) return part;
      let next = part;
      if (/[가-힣]{2,}/.test(part) && Math.random() > 0.72) next = sample(SURREAL_NOUNS);
      if (/[게히]$/.test(part) && Math.random() > 0.55) next = sample(WEIRD_ADVERBS);
      if (/[은는이가을를의에로와과]$/.test(part) && Math.random() > 0.5) next = sample(WEIRD_PARTICLES);
      if (/[다요까]$/.test(part) && Math.random() > 0.55) next = part.replace(/[다요까]$/, sample(WEIRD_ENDINGS));
      return Math.random() > 0.9 ? `${next}${next}` : next;
    });
    patch("babelOutput", chunks.join("").replace(/\s/g, () => (Math.random() > 0.85 ? sample(GLITCH_MARKS) : " ")));
  };

  return (
    <Panel title="바벨 글리치" actions={<button className="primary" onClick={run}><Sparkles size={17} /> 무너뜨리기</button>}>
      <textarea value={state.babelInput} onChange={(e) => patch("babelInput", e.target.value)} rows={5} />
      <div className="control-grid">
        <Range label={`글자 진동 ${state.babelBump}`} min="0" max="100" value={state.babelBump} onChange={(v) => patch("babelBump", v)} />
        <Range label={`비틀림 ${state.babelTilt}°`} min="0" max="45" value={state.babelTilt} onChange={(v) => patch("babelTilt", v)} />
      </div>
      <JitterText text={state.babelOutput || "글리치 결과가 여기에 나타납니다."} bump={state.babelBump / 100} tilt={state.babelTilt} />
    </Panel>
  );
}

function Roussel({ state, patch, nouns }) {
  const generate = () => {
    const words = splitWords(state.rousselInitial);
    const base = words.slice(0, -1).join(" ");
    const target = getRhymeTarget(state.rousselInitial);
    patch("rousselBase", base);
    patch("rousselWords", getMatchedWords(target, nouns));
    patch("rousselStep", 2);
  };
  const chosenSentence = `${state.rousselBase} ${state.rousselSelected}`.trim();

  return (
    <Panel title="루셀의 다리">
      {state.rousselStep === 1 && (
        <div className="inline-form">
          <input value={state.rousselInitial} onChange={(e) => patch("rousselInitial", e.target.value)} placeholder="한 줄의 어구를 입력하세요" />
          <button className="primary" onClick={generate}>파편 흩뿌리기</button>
        </div>
      )}
      {state.rousselStep === 2 && (
        <>
          <div className="source-line">{state.rousselInitial}</div>
          <div className="word-grid">
            {state.rousselWords.map((word) => (
              <button key={word} title={`${state.rousselBase} ${word}`} onClick={() => (patch("rousselSelected", word), patch("rousselStep", 3))}>
                {word}
              </button>
            ))}
          </div>
          <button onClick={() => patch("rousselWords", (items) => [...items].sort(() => Math.random() - 0.5))}><RefreshCcw size={17} /> 다시 부르기</button>
        </>
      )}
      {state.rousselStep === 3 && (
        <>
          <div className="torn top">{state.rousselInitial}</div>
          <textarea value={state.rousselBody} onChange={(e) => patch("rousselBody", e.target.value)} rows={6} placeholder="사이를 이을 불가능한 간극의 본문" />
          <div className="torn bottom">{chosenSentence}</div>
          <div className="actions">
            <button onClick={() => patch("rousselStep", 2)}>뒤로</button>
            <button className="primary" onClick={() => {
              patch("rousselPinned", (items) => [...items, `${state.rousselInitial} ${state.rousselBody} ${chosenSentence}`.trim()]);
              patch("rousselBody", "");
              patch("rousselStep", 1);
            }}>기록</button>
          </div>
        </>
      )}
      <div className="poem">
        {state.rousselPinned.map((item, index) => <p key={`${item}-${index}`}>{index + 1}. {item}</p>)}
      </div>
    </Panel>
  );
}

function getRhymeTarget(sentence) {
  const words = sentence.replace(/[^\w\s가-힣]/g, "").trim().split(/\s+/);
  const last = words.at(-1) || "";
  const prev = words.at(-2) || "";
  if (!prev) return last.slice(-3);
  return last.length + prev.length <= 3 ? prev + last : last.slice(-3);
}

function decomposeHangul(char) {
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return null;
  return [Math.floor(code / 588), Math.floor((code % 588) / 28), code % 28];
}

function looseVowel(vowel) {
  return { 2: 0, 6: 4, 12: 8, 17: 13, 5: 1, 3: 1, 7: 1, 11: 1, 10: 1, 15: 1 }[vowel] ?? vowel;
}

function matchRhyme(target, word) {
  if (word.length < target.length) return false;
  for (let i = 1; i <= target.length; i += 1) {
    const a = decomposeHangul(target.at(-i));
    const b = decomposeHangul(word.at(-i));
    if (!a || !b) {
      if (target.at(-i) !== word.at(-i)) return false;
    } else if (looseVowel(a[1]) !== looseVowel(b[1])) return false;
  }
  return true;
}

function getMatchedWords(target, nouns) {
  let matched = nouns.filter((word) => matchRhyme(target, word));
  if (matched.length < 25 && target.length > 1) matched = matched.concat(nouns.filter((word) => matchRhyme(target.slice(-1), word)));
  matched = [...new Set(matched)];
  while (matched.length < 25 && nouns.length) matched.push(sample(nouns));
  return [...new Set(matched)].sort(() => Math.random() - 0.5).slice(0, 25);
}

function Disparition({ state, patch }) {
  const [wordInput, setWordInput] = useState("");
  const toggleLetter = (letter) => patch("forbiddenLetters", (items) => (items.includes(letter) ? items.filter((item) => item !== letter) : [...items, letter]));
  const addWords = () => {
    const words = wordInput.split(",").map((item) => item.trim()).filter(Boolean);
    patch("forbiddenWords", (items) => [...new Set(items.concat(words))]);
    setWordInput("");
  };

  const write = (value) => {
    const violation = findViolation(value, state.forbiddenWords, state.forbiddenLetters);
    if (!violation) {
      patch("disparitionText", value);
      patch("violation", "");
      return;
    }
    patch("violation", `허락되지 않은 파편: ${violation.match}`);
    setTimeout(() => patch("violation", ""), 1300);
  };

  if (state.disparitionWriting) {
    return (
      <Panel title="실종 에디터" actions={<button onClick={() => patch("disparitionWriting", false)}>제약 설정</button>}>
        <div className="constraint-line">금지어: {state.forbiddenWords.join(", ") || "없음"} / 금지 자모: {state.forbiddenLetters.join(", ") || "없음"}</div>
        <textarea className="large-editor" value={state.disparitionText} onChange={(e) => write(e.target.value)} rows={13} placeholder="제약을 피해 문장을 이어나가십시오." />
        {state.violation && <p className="warning">{state.violation}</p>}
      </Panel>
    );
  }

  return (
    <Panel
      title="금지 규칙"
      actions={
        <button className="primary" onClick={() => patch("disparitionWriting", true)}>
          <Type size={17} /> 집필 시작
        </button>
      }
    >
      <div className="inline-form">
        <input value={wordInput} onChange={(e) => setWordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWords()} placeholder="금지어를 쉼표로 구분" />
        <button onClick={addWords}>추가</button>
      </div>
      <div className="chips">
        {state.forbiddenWords.map((word) => <button key={word} onClick={() => patch("forbiddenWords", (items) => items.filter((item) => item !== word))}>{word} ×</button>)}
      </div>
      <div className="letter-section">
        <h4>자음</h4>
        <LetterGrid letters={CHO_LIST} active={state.forbiddenLetters} onToggle={toggleLetter} />
        <h4>모음</h4>
        <LetterGrid letters={JUNG_LIST} active={state.forbiddenLetters} onToggle={toggleLetter} />
      </div>
      <button onClick={() => patch("forbiddenLetters", [...CHO_LIST, ...JUNG_LIST].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3)))}>
        <Shuffle size={17} /> 무작위 제약
      </button>
    </Panel>
  );
}

function LetterGrid({ letters, active, onToggle }) {
  return <div className="letter-grid">{letters.map((letter) => <button key={letter} className={active.includes(letter) ? "active" : ""} onClick={() => onToggle(letter)}>{letter}</button>)}</div>;
}

function findViolation(text, forbiddenWords, forbiddenLetters) {
  for (const word of forbiddenWords) {
    const idx = text.search(new RegExp(escapeRegExp(word)));
    if (idx >= 0) return { index: idx, match: word };
  }
  for (const char of text) {
    if (forbiddenLetters.includes(char)) return { match: char };
    const parts = decomposeHangul(char);
    if (!parts) continue;
    const cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"][parts[0]];
    const jung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"][parts[1]];
    const jong = JONG_LIST[parts[2]];
    const jongs = JONG_MAP[jong] || (jong ? [jong] : []);
    if ([cho, jung, ...jongs].some((item) => forbiddenLetters.includes(item))) return { match: char };
  }
  return null;
}

function Range({ label, value, onChange, ...props }) {
  return (
    <label className="range">
      <span>{label}</span>
      <input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))} {...props} />
    </label>
  );
}

function FragmentCloud({ nouns }) {
  const items = useMemo(() => nouns.sort(() => Math.random() - 0.5).slice(0, 42), [nouns]);
  return (
    <section className="fragment-cloud" aria-label="사전의 파편들">
      {items.map((noun, index) => (
        <span key={`${noun}-${index}`} style={{ backgroundColor: WASHED_COLORS[index % WASHED_COLORS.length], animationDelay: `${(index % 8) * 0.22}s` }}>
          {noun}
        </span>
      ))}
    </section>
  );
}

export default App;
