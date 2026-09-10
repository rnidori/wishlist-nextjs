"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  X,
  Star,
  Search,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Wine,
  Eye,
  Cookie,
  BookOpen,
  Coffee,
  ShoppingBag,
  Shirt,
  Gift,
  Sparkles,
} from "lucide-react";

// ---------- 테마 ----------

const THEME = {
  light: {
    bg: "#FFFFFF",
    text: "#1D1D1F",
    secondaryText: "#86868B",
    border: "#E5E5EA",
    surface: "#F5F5F7",
    accent: "#007AFF",
    accentSoft: "rgba(0, 122, 255, 0.12)",
    danger: "#FF3B30",
    overlay: "rgba(0,0,0,0.35)",
  },
  dark: {
    bg: "#000000",
    text: "#F5F5F7",
    secondaryText: "#8E8E93",
    border: "#38383A",
    surface: "#1C1C1E",
    accent: "#0A84FF",
    accentSoft: "rgba(10, 132, 255, 0.18)",
    danger: "#FF453A",
    overlay: "rgba(0,0,0,0.6)",
  },
};

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// ---------- 아이콘 선택지 ----------

const ICON_MAP = { Wine, Eye, Cookie, BookOpen, Coffee, ShoppingBag, Shirt, Gift, Sparkles };
const ICON_CHOICES = Object.keys(ICON_MAP);

function CategoryIcon({ name, size = 18, color }) {
  const Comp = ICON_MAP[name] || Sparkles;
  return <Comp size={size} color={color} strokeWidth={1.8} />;
}

// ---------- 기본 데이터 ----------

const STARTER_CATEGORIES = [
  {
    id: "wine",
    name: "와인",
    icon: "Wine",
    fields: [
      { key: "recommender", label: "추천인", type: "text" },
      { key: "rating", label: "내 선호도", type: "rating" },
      { key: "price", label: "가격(원)", type: "number" },
      { key: "when", label: "마시면 좋은 시기", type: "text" },
      { key: "taste", label: "맛 특징", type: "text" },
    ],
  },
  {
    id: "lens",
    name: "써클렌즈",
    icon: "Eye",
    fields: [
      { key: "brand", label: "브랜드", type: "text" },
      { key: "colorName", label: "색상", type: "text" },
      { key: "size", label: "크기(직경)", type: "text" },
      { key: "rating", label: "평점", type: "rating" },
    ],
  },
  {
    id: "cheese",
    name: "치즈",
    icon: "Cookie",
    fields: [
      { key: "cheeseType", label: "치즈 종류", type: "text" },
      { key: "wineFit", label: "어울리는 와인", type: "text" },
      { key: "foodFit", label: "어울리는 음식", type: "text" },
      { key: "rating", label: "평점", type: "rating" },
      { key: "price", label: "가격(원)", type: "number" },
    ],
  },
  {
    id: "book",
    name: "책",
    icon: "BookOpen",
    fields: [
      {
        key: "genre",
        label: "책 종류",
        type: "select",
        options: ["소설", "에세이", "인문", "자기계발", "경제/경영", "과학", "시/희곡", "만화", "아동", "기타"],
      },
      { key: "recommender", label: "추천인", type: "text" },
      { key: "rating", label: "평점", type: "rating" },
      { key: "price", label: "가격(원)", type: "number" },
    ],
  },
];

const STARTER_ITEMS = [
  { id: "i1", categoryId: "wine", name: "샤또 무똥 카데 루즈", memo: "",
    values: { recommender: "민지", rating: 4, price: 45000, when: "스테이크 먹을 때", taste: "바디감 묵직, 타닌 강함" } },
  { id: "i2", categoryId: "wine", name: "키안티 클라시코", memo: "",
    values: { recommender: "회사 와인모임", rating: 3, price: 32000, when: "가벼운 파스타 안주", taste: "산미 있음, 체리향" } },
  { id: "i3", categoryId: "lens", name: "글램룩 그레이", memo: "",
    values: { brand: "글램룩", colorName: "그레이", size: "14.2mm", rating: 5 } },
  { id: "i4", categoryId: "cheese", name: "브리 드 뫼", memo: "",
    values: { cheeseType: "연성치즈(까망베르류)", wineFit: "샴페인, 가벼운 화이트와인", foodFit: "바게트, 견과류, 꿀", rating: 4, price: 18000 } },
  { id: "i5", categoryId: "book", name: "달러구트 꿈 백화점", memo: "",
    values: { genre: "소설", recommender: "인스타 북튜버", rating: 4, price: 14800 } },
];

const FIELD_TYPES = [
  { value: "text", label: "텍스트" },
  { value: "number", label: "숫자" },
  { value: "rating", label: "평점(별)" },
  { value: "select", label: "선택지" },
];

let idCounter = 100;
const nextId = (prefix) => `${prefix}${idCounter++}`;

// ---------- 작은 컴포넌트 ----------

function StarRating({ value = 0, onChange, size = 15, readOnly = false, c }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-0.5">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            size={size}
            fill={s <= value ? c.accent : "none"}
            color={s <= value ? c.accent : c.secondaryText}
            strokeWidth={1.6}
          />
        </button>
      ))}
    </div>
  );
}

function Row({ children, onClick, c, last }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3"
      style={{
        borderBottom: last ? "none" : `1px solid ${c.border}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

// ---------- 카테고리 추가 모달 ----------

function AddCategoryModal({ onClose, onCreate, c }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_CHOICES[0]);
  const [fields, setFields] = useState([{ key: nextId("f"), label: "", type: "text" }]);

  const addField = () => setFields([...fields, { key: nextId("f"), label: "", type: "text" }]);
  const updateField = (idx, patch) => setFields(fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));
  const canSave = name.trim() && fields.some((f) => f.label.trim());

  const inputStyle = {
    backgroundColor: c.surface,
    color: c.text,
    border: "none",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: c.overlay }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: c.bg, fontFamily: FONT_STACK }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontSize: 19, fontWeight: 600, color: c.text }}>새 카테고리</h3>
          <button onClick={onClose}>
            <X size={20} color={c.secondaryText} />
          </button>
        </div>

        <label className="text-xs" style={{ color: c.secondaryText }}>이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 향수, 조명, 텀블러..."
          className="w-full mt-1.5 mb-5 px-3 py-2.5 rounded-lg text-sm outline-none"
          style={inputStyle}
        />

        <label className="text-xs" style={{ color: c.secondaryText }}>아이콘</label>
        <div className="grid grid-cols-5 gap-2 mt-1.5 mb-5">
          {ICON_CHOICES.map((iconName) => {
            const selected = icon === iconName;
            return (
              <button
                key={iconName}
                onClick={() => setIcon(iconName)}
                className="flex items-center justify-center rounded-lg py-2.5"
                style={{
                  backgroundColor: selected ? c.accentSoft : c.surface,
                }}
              >
                <CategoryIcon name={iconName} size={18} color={selected ? c.accent : c.secondaryText} />
              </button>
            );
          })}
        </div>

        <label className="text-xs" style={{ color: c.secondaryText }}>저장할 항목들</label>
        <div className="mt-1.5 space-y-2">
          {fields.map((f, idx) => (
            <div key={f.key}>
              <div className="flex gap-2 items-center">
                <input
                  value={f.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                  placeholder="항목 이름 (예: 브랜드)"
                  className="flex-1 px-2.5 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
                <select
                  value={f.type}
                  onChange={(e) => updateField(idx, { type: e.target.value })}
                  className="px-2 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <button onClick={() => removeField(idx)} disabled={fields.length === 1}>
                  <Trash2 size={16} color={fields.length === 1 ? c.border : c.danger} />
                </button>
              </div>
              {f.type === "select" && (
                <input
                  value={(f.options || []).join(", ")}
                  onChange={(e) =>
                    updateField(idx, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                  }
                  placeholder="선택지를 쉼표로 구분해서 입력 (예: 소설, 에세이, 인문)"
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-xs outline-none"
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>
        <button onClick={addField} className="mt-3 text-sm flex items-center gap-1" style={{ color: c.accent }}>
          <Plus size={14} /> 항목 추가
        </button>

        <div className="flex gap-2 mt-7">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: c.surface, color: c.text }}
          >
            취소
          </button>
          <button
            disabled={!canSave}
            onClick={() =>
              onCreate({ id: nextId("cat"), name: name.trim(), icon, fields: fields.filter((f) => f.label.trim()) })
            }
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: canSave ? c.accent : c.border }}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 아이템 추가 모달 ----------

function AddItemModal({ category, onClose, onCreate, c }) {
  const [name, setName] = useState("");
  const [values, setValues] = useState({});
  const setV = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  const inputStyle = { backgroundColor: c.surface, color: c.text, border: "none" };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: c.overlay }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: c.bg, fontFamily: FONT_STACK }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontSize: 19, fontWeight: 600, color: c.text }}>{category.name} 항목 추가</h3>
          <button onClick={onClose}>
            <X size={20} color={c.secondaryText} />
          </button>
        </div>

        <label className="text-xs" style={{ color: c.secondaryText }}>이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="제품/항목 이름"
          className="w-full mt-1.5 mb-5 px-3 py-2.5 rounded-lg text-sm outline-none"
          style={inputStyle}
        />

        <div className="space-y-4">
          {category.fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs" style={{ color: c.secondaryText }}>{f.label}</label>
              <div className="mt-1.5">
                {f.type === "rating" ? (
                  <StarRating value={values[f.key] || 0} onChange={(v) => setV(f.key, v)} size={22} c={c} />
                ) : f.type === "number" ? (
                  <input
                    type="number"
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                ) : f.type === "select" && f.options && f.options.length > 0 ? (
                  <select
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  >
                    <option value="">선택 안 함</option>
                    {f.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                ) : (
                  <input
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-7">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: c.surface, color: c.text }}>
            취소
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onCreate({ id: nextId("item"), categoryId: category.id, name: name.trim(), memo: "", values })}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: name.trim() ? c.accent : c.border }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 홈 화면 ----------

function HomeScreen({ categories, items, onOpenCategory, onAddCategory, dark, onToggleDark, c }) {
  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <div className="px-5 pt-8 pb-3 flex items-center justify-between">
        <h1 style={{ fontSize: 30, fontWeight: 700, color: c.text, letterSpacing: -0.4 }}>위시리스트</h1>
        <button
          onClick={onToggleDark}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c.surface }}
        >
          {dark ? <Sun size={17} color={c.text} /> : <Moon size={17} color={c.text} />}
        </button>
      </div>

      <div className="px-5 mt-3">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
          {categories.map((cat, idx) => (
            <Row key={cat.id} c={c} last={idx === categories.length - 1} onClick={() => onOpenCategory(cat.id)}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.accentSoft }}
              >
                <CategoryIcon name={cat.icon} size={16} color={c.accent} />
              </div>
              <span className="flex-1 text-[15px]" style={{ color: c.text, fontWeight: 500 }}>{cat.name}</span>
              <span className="text-sm" style={{ color: c.secondaryText }}>
                {items.filter((i) => i.categoryId === cat.id).length}
              </span>
              <ChevronRight size={16} color={c.border} />
            </Row>
          ))}
        </div>

        <button
          onClick={onAddCategory}
          className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-2xl"
          style={{ border: `1px solid ${c.border}` }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.surface }}>
            <Plus size={16} color={c.accent} />
          </div>
          <span className="text-[15px]" style={{ color: c.accent, fontWeight: 500 }}>카테고리 추가</span>
        </button>
      </div>
    </div>
  );
}

// ---------- 카테고리 상세 화면 ----------

function CategoryScreen({ category, items, onBack, onAddItem, onDeleteItem, c }) {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectFilters, setSelectFilters] = useState({});

  const ratingFieldExists = category.fields.some((f) => f.type === "rating");
  const selectFields = category.fields.filter((f) => f.type === "select" && f.options && f.options.length > 0);

  const filteredItems = useMemo(() => {
    return items
      .filter((it) => it.categoryId === category.id)
      .filter((it) => {
        if (!search.trim()) return true;
        const hay = [it.name, ...Object.values(it.values || {})].join(" ").toLowerCase();
        return hay.includes(search.toLowerCase());
      })
      .filter((it) => {
        const ratingField = category.fields.find((f) => f.type === "rating");
        if (!ratingField || minRating === 0) return true;
        return Number(it.values[ratingField.key] || 0) >= minRating;
      })
      .filter((it) => Object.entries(selectFilters).every(([key, val]) => !val || it.values[key] === val));
  }, [items, category, search, minRating, selectFilters]);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-0.5" style={{ color: c.accent }}>
          <ChevronLeft size={20} />
          <span className="text-[15px]">위시리스트</span>
        </button>
        <button onClick={onAddItem} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: c.accentSoft }}>
          <Plus size={16} color={c.accent} />
        </button>
      </div>

      <div className="px-5 pt-2 pb-3">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>{category.name}</h1>
      </div>

      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: c.surface }}>
          <Search size={15} color={c.secondaryText} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색"
            className="text-sm outline-none flex-1 bg-transparent"
            style={{ color: c.text }}
          />
        </div>

        {(ratingFieldExists || selectFields.length > 0) && (
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            {ratingFieldExists && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: c.surface }}>
                <span className="text-xs" style={{ color: c.secondaryText }}>최소</span>
                <StarRating value={minRating} onChange={(v) => setMinRating(v === minRating ? 0 : v)} size={13} c={c} />
              </div>
            )}
            {selectFields.map((f) => (
              <select
                key={f.key}
                value={selectFilters[f.key] || ""}
                onChange={(e) => setSelectFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="px-3 py-1.5 rounded-full text-xs outline-none"
                style={{ backgroundColor: c.surface, color: c.text }}
              >
                <option value="">{f.label} 전체</option>
                {f.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            ))}
          </div>
        )}
      </div>

      <div className="px-5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: c.secondaryText }}>
            아직 저장된 항목이 없어요.
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="px-4 py-3 group"
                style={{ borderBottom: idx === filteredItems.length - 1 ? "none" : `1px solid ${c.border}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[15px]" style={{ color: c.text, fontWeight: 600 }}>{item.name}</h4>
                  <button onClick={() => onDeleteItem(item.id)}>
                    <Trash2 size={14} color={c.secondaryText} />
                  </button>
                </div>
                <div className="mt-1.5 space-y-1">
                  {category.fields.map((f) => {
                    const v = item.values[f.key];
                    if (v === undefined || v === "") return null;
                    return (
                      <div key={f.key} className="flex items-baseline gap-2 text-[13px]">
                        <span style={{ color: c.secondaryText, minWidth: 68 }}>{f.label}</span>
                        {f.type === "rating" ? (
                          <StarRating value={Number(v)} readOnly size={12} c={c} />
                        ) : (
                          <span style={{ color: c.text }}>{f.type === "number" ? Number(v).toLocaleString() : v}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-8" />
    </div>
  );
}

// ---------- 메인 앱 ----------

export default function WishlistApp() {
  const [categories, setCategories] = useState(STARTER_CATEGORIES);
  const [items, setItems] = useState(STARTER_ITEMS);
  const [view, setView] = useState("home"); // 'home' | 'category'
  const [activeCatId, setActiveCatId] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [dark, setDark] = useState(false);

  const c = dark ? THEME.dark : THEME.light;
  const activeCat = categories.find((cat) => cat.id === activeCatId);

  return (
    <div style={{ backgroundColor: c.bg }}>
      {view === "home" ? (
        <HomeScreen
          categories={categories}
          items={items}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onOpenCategory={(id) => {
            setActiveCatId(id);
            setView("category");
          }}
          onAddCategory={() => setShowAddCat(true)}
          c={c}
        />
      ) : (
        activeCat && (
          <CategoryScreen
            category={activeCat}
            items={items}
            onBack={() => setView("home")}
            onAddItem={() => setShowAddItem(true)}
            onDeleteItem={(id) => setItems(items.filter((i) => i.id !== id))}
            c={c}
          />
        )
      )}

      {showAddCat && (
        <AddCategoryModal
          c={c}
          onClose={() => setShowAddCat(false)}
          onCreate={(cat) => {
            setCategories([...categories, cat]);
            setShowAddCat(false);
          }}
        />
      )}
      {showAddItem && activeCat && (
        <AddItemModal
          c={c}
          category={activeCat}
          onClose={() => setShowAddItem(false)}
          onCreate={(item) => {
            setItems([...items, item]);
            setShowAddItem(false);
          }}
        />
      )}
    </div>
  );
}
