"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  X,
  Star,
  Search,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Circle,
  CheckCircle2,
  GripVertical,
  Clock,
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

// ---------- 기본 데이터 ----------

const STARTER_CATEGORIES = [
  {
    id: "wine",
    name: "와인",
    emoji: "🍷",
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
    emoji: "👁️",
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
    emoji: "🧀",
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
    emoji: "📚",
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
  { id: "i1", categoryId: "wine", name: "샤또 무똥 카데 루즈", memo: "", purchased: false,
    values: { recommender: "민지", rating: 4, price: 45000, when: "스테이크 먹을 때", taste: "바디감 묵직, 타닌 강함" } },
  { id: "i2", categoryId: "wine", name: "키안티 클라시코", memo: "", purchased: false,
    values: { recommender: "회사 와인모임", rating: 3, price: 32000, when: "가벼운 파스타 안주", taste: "산미 있음, 체리향" } },
  { id: "i3", categoryId: "lens", name: "글램룩 그레이", memo: "", purchased: false,
    values: { brand: "글램룩", colorName: "그레이", size: "14.2mm", rating: 5 } },
  { id: "i4", categoryId: "cheese", name: "브리 드 뫼", memo: "", purchased: false,
    values: { cheeseType: "연성치즈(까망베르류)", wineFit: "샴페인, 가벼운 화이트와인", foodFit: "바게트, 견과류, 꿀", rating: 4, price: 18000 } },
  { id: "i5", categoryId: "book", name: "달러구트 꿈 백화점", memo: "", purchased: false,
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
          onClick={(e) => {
            e.stopPropagation();
            onChange && onChange(s);
          }}
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

// ---------- 카테고리 추가 모달 ----------

function AddCategoryModal({ onClose, onCreate, c }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [fields, setFields] = useState([{ key: nextId("f"), label: "", type: "text" }]);

  const addField = () => setFields([...fields, { key: nextId("f"), label: "", type: "text" }]);
  const updateField = (idx, patch) => setFields(fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));
  const canSave = name.trim() && fields.some((f) => f.label.trim());

  const inputStyle = { backgroundColor: c.surface, color: c.text, border: "none" };

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

        <label className="text-xs" style={{ color: c.secondaryText }}>이모지</label>
        <div className="flex items-center gap-3 mt-1.5 mb-5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: c.accentSoft }}
          >
            {emoji || "＋"}
          </div>
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
            placeholder="이모지를 붙여넣어보세요 (예: 🍷)"
            className="flex-1 px-3 py-2.5 rounded-full text-sm outline-none"
            style={inputStyle}
          />
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
            className="flex-1 py-2.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: c.surface, color: c.text }}
          >
            취소
          </button>
          <button
            disabled={!canSave}
            onClick={() =>
              onCreate({
                id: nextId("cat"),
                name: name.trim(),
                emoji: emoji || "📦",
                fields: fields.filter((f) => f.label.trim()),
              })
            }
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: canSave ? c.accent : c.border }}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 아이템 추가/수정 모달 ----------

function ItemModal({ category, initial, onClose, onSave, c }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || "");
  const [values, setValues] = useState(initial?.values || {});
  const [memo, setMemo] = useState(initial?.memo || "");
  const setV = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  const inputStyle = { backgroundColor: c.surface, color: c.text, border: "none" };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: c.overlay }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: c.bg, fontFamily: FONT_STACK }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontSize: 19, fontWeight: 600, color: c.text }}>
            {isEdit ? "항목 수정" : `${category.name} 항목 추가`}
          </h3>
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

          <div>
            <label className="text-xs" style={{ color: c.secondaryText }}>메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="자유롭게 메모를 남겨보세요"
              rows={3}
              className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-7">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: c.surface, color: c.text }}>
            취소
          </button>
          <button
            disabled={!name.trim()}
            onClick={() =>
              onSave({
                id: initial?.id || nextId("item"),
                categoryId: category.id,
                name: name.trim(),
                memo,
                purchased: initial?.purchased || false,
                values,
              })
            }
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: name.trim() ? c.accent : c.border }}
          >
            {isEdit ? "수정 완료" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 홈 화면 (카테고리 목록, 드래그 정렬) ----------

function HomeScreen({ categories, setCategories, items, onOpenCategory, onAddCategory, onOpenSearch, c }) {
  const [draggingIdx, setDraggingIdx] = useState(null);

  useEffect(() => {
    if (draggingIdx === null) return;

    const handleMove = (e) => {
      const point = e.touches ? e.touches[0] : e;
      const el = document.elementFromPoint(point.clientX, point.clientY);
      const row = el && el.closest("[data-cat-idx]");
      if (row) {
        const idx = Number(row.getAttribute("data-cat-idx"));
        if (idx !== draggingIdx) {
          setCategories((prev) => {
            const arr = [...prev];
            const [moved] = arr.splice(draggingIdx, 1);
            arr.splice(idx, 0, moved);
            return arr;
          });
          setDraggingIdx(idx);
        }
      }
    };
    const handleUp = () => setDraggingIdx(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [draggingIdx, setCategories]);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <div className="px-5 pt-8 pb-3 flex items-center justify-between">
        <h1 style={{ fontSize: 30, fontWeight: 700, color: c.text, letterSpacing: -0.4 }}>위시리스트</h1>
        <button
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c.surface }}
        >
          <Search size={16} color={c.text} />
        </button>
      </div>

      <div className="px-5 mt-3 space-y-2.5">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            data-cat-idx={idx}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full"
            style={{
              backgroundColor: c.surface,
              opacity: draggingIdx === idx ? 0.6 : 1,
            }}
          >
            <button
              onClick={() => onOpenCategory(cat.id)}
              className="flex-1 flex items-center gap-3 text-left"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base"
                style={{ backgroundColor: c.bg }}
              >
                {cat.emoji || "📦"}
              </div>
              <span className="flex-1 text-[15px]" style={{ color: c.text, fontWeight: 500 }}>{cat.name}</span>
              <span className="text-sm" style={{ color: c.secondaryText }}>
                {items.filter((i) => i.categoryId === cat.id).length}
              </span>
              <ChevronRight size={16} color={c.secondaryText} />
            </button>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                setDraggingIdx(idx);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setDraggingIdx(idx);
              }}
              style={{ touchAction: "none", cursor: "grab" }}
              className="p-1 -mr-1 shrink-0"
            >
              <GripVertical size={16} color={c.secondaryText} />
            </button>
          </div>
        ))}

        <button
          onClick={onAddCategory}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ border: `1.5px dashed ${c.border}` }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: c.accentSoft }}>
            <Plus size={16} color={c.accent} />
          </div>
          <span className="text-[15px]" style={{ color: c.accent, fontWeight: 500 }}>카테고리 추가</span>
        </button>
      </div>
    </div>
  );
}

// ---------- 검색 화면 ----------

function SearchScreen({ items, categories, recentSearches, onSelectItem, onSearchTerm, onRemoveRecent, onClearRecent, onBack, c }) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const starts = [];
    const includes = [];
    items.forEach((it) => {
      const n = it.name.toLowerCase();
      if (n.startsWith(q)) starts.push(it);
      else if (n.includes(q)) includes.push(it);
    });
    return [...starts, ...includes].slice(0, 8);
  }, [query, items]);

  const catById = (id) => categories.find((c2) => c2.id === id);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <div className="px-4 pt-6 pb-3 flex items-center gap-2">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft size={22} color={c.accent} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-full" style={{ backgroundColor: c.surface }}>
          <Search size={15} color={c.secondaryText} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) onSearchTerm(query.trim());
            }}
            placeholder="아이템 이름으로 검색"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: c.text }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={14} color={c.secondaryText} />
            </button>
          )}
        </div>
      </div>

      <div className="px-5">
        {query.trim() ? (
          suggestions.length === 0 ? (
            <div className="text-center py-16 text-sm" style={{ color: c.secondaryText }}>
              일치하는 아이템이 없어요.
            </div>
          ) : (
            <div className="space-y-1.5 mt-2">
              {suggestions.map((it) => {
                const cat = catById(it.categoryId);
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      onSearchTerm(it.name);
                      onSelectItem(it);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                    style={{ backgroundColor: c.surface }}
                  >
                    <span className="text-base shrink-0">{cat?.emoji || "📦"}</span>
                    <span className="flex-1 text-[14px]" style={{ color: c.text }}>{it.name}</span>
                    <span className="text-xs" style={{ color: c.secondaryText }}>{cat?.name}</span>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div className="mt-2">
            {recentSearches.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-xs" style={{ color: c.secondaryText }}>최근 검색</span>
                  <button onClick={onClearRecent} className="text-xs" style={{ color: c.accent }}>전체 삭제</button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    >
                      <Clock size={14} color={c.secondaryText} />
                      <button
                        onClick={() => setQuery(term)}
                        className="flex-1 text-left text-sm"
                        style={{ color: c.text }}
                      >
                        {term}
                      </button>
                      <button onClick={() => onRemoveRecent(term)}>
                        <X size={13} color={c.secondaryText} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- 카테고리 상세 화면 ----------

function CategoryScreen({ category, items, onBack, onAddItem, onEditItem, onDeleteItem, onTogglePurchased, initialSearch, c }) {
  const [search, setSearch] = useState(initialSearch || "");
  const [minRating, setMinRating] = useState(0);
  const [selectFilters, setSelectFilters] = useState({});
  const [sortBy, setSortBy] = useState("recent");

  const ratingField = category.fields.find((f) => f.type === "rating");
  const priceField = category.fields.find((f) => f.type === "number");
  const selectFields = category.fields.filter((f) => f.type === "select" && f.options && f.options.length > 0);

  const categoryItems = useMemo(
    () => items.filter((it) => it.categoryId === category.id),
    [items, category.id]
  );
  const itemIndex = useMemo(() => {
    const map = {};
    categoryItems.forEach((it, idx) => { map[it.id] = idx; });
    return map;
  }, [categoryItems]);

  const sortedItems = useMemo(() => {
    const filtered = categoryItems
      .filter((it) => {
        if (!search.trim()) return true;
        const hay = [it.name, it.memo || "", ...Object.values(it.values || {})].join(" ").toLowerCase();
        return hay.includes(search.toLowerCase());
      })
      .filter((it) => {
        if (!ratingField || minRating === 0) return true;
        return Number(it.values[ratingField.key] || 0) >= minRating;
      })
      .filter((it) => Object.entries(selectFilters).every(([key, val]) => !val || it.values[key] === val));

    const arr = [...filtered];
    arr.sort((a, b) => {
      if (!!a.purchased !== !!b.purchased) return a.purchased ? 1 : -1;
      if (sortBy === "rating" && ratingField) {
        return Number(b.values[ratingField.key] || 0) - Number(a.values[ratingField.key] || 0);
      }
      if (sortBy === "price" && priceField) {
        return Number(a.values[priceField.key] || 0) - Number(b.values[priceField.key] || 0);
      }
      return (itemIndex[b.id] ?? 0) - (itemIndex[a.id] ?? 0);
    });
    return arr;
  }, [categoryItems, search, minRating, selectFilters, sortBy, ratingField, priceField, itemIndex]);

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

        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs outline-none"
            style={{ backgroundColor: c.surface, color: c.text }}
          >
            <option value="recent">최근 추가순</option>
            {ratingField && <option value="rating">평점 높은순</option>}
            {priceField && <option value="price">{priceField.label} 낮은순</option>}
          </select>

          {ratingField && (
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
      </div>

      <div className="px-5 space-y-2.5">
        {sortedItems.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: c.secondaryText }}>
            아직 저장된 항목이 없어요.
          </div>
        ) : (
          sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onEditItem(item)}
              className="px-4 py-3.5 rounded-2xl flex gap-3 cursor-pointer"
              style={{ backgroundColor: c.surface, opacity: item.purchased ? 0.55 : 1 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePurchased(item.id);
                }}
                className="shrink-0 mt-0.5"
              >
                {item.purchased ? (
                  <CheckCircle2 size={20} color={c.accent} />
                ) : (
                  <Circle size={20} color={c.secondaryText} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4
                      className="text-[15px] truncate"
                      style={{
                        color: c.text,
                        fontWeight: 600,
                        textDecoration: item.purchased ? "line-through" : "none",
                      }}
                    >
                      {item.name}
                    </h4>
                    {item.purchased && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.accentSoft, color: c.accent }}
                      >
                        구매완료
                      </span>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }} className="shrink-0">
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
                  {item.memo && (
                    <div className="text-[13px] mt-1" style={{ color: c.secondaryText, fontStyle: "italic" }}>
                      {item.memo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
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
  const [view, setView] = useState("home"); // 'home' | 'category' | 'search'
  const [activeCatId, setActiveCatId] = useState(null);
  const [pendingSearch, setPendingSearch] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [dark, setDark] = useState(false);

  // 폰/시스템 다크모드 설정을 그대로 따라감
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const c = dark ? THEME.dark : THEME.light;
  const activeCat = categories.find((cat) => cat.id === activeCatId);

  const addRecentSearch = (term) => {
    setRecentSearches((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, 8));
  };

  return (
    <div style={{ backgroundColor: c.bg }}>
      {view === "home" && (
        <HomeScreen
          categories={categories}
          setCategories={setCategories}
          items={items}
          onOpenCategory={(id) => {
            setActiveCatId(id);
            setPendingSearch("");
            setView("category");
          }}
          onAddCategory={() => setShowAddCat(true)}
          onOpenSearch={() => setView("search")}
          c={c}
        />
      )}

      {view === "search" && (
        <SearchScreen
          items={items}
          categories={categories}
          recentSearches={recentSearches}
          onSearchTerm={addRecentSearch}
          onRemoveRecent={(term) => setRecentSearches((prev) => prev.filter((t) => t !== term))}
          onClearRecent={() => setRecentSearches([])}
          onSelectItem={(item) => {
            setActiveCatId(item.categoryId);
            setPendingSearch(item.name);
            setView("category");
          }}
          onBack={() => setView("home")}
          c={c}
        />
      )}

      {view === "category" && activeCat && (
        <CategoryScreen
          category={activeCat}
          items={items}
          initialSearch={pendingSearch}
          onBack={() => setView("home")}
          onAddItem={() => {
            setEditingItem(null);
            setShowItemModal(true);
          }}
          onEditItem={(item) => {
            setEditingItem(item);
            setShowItemModal(true);
          }}
          onDeleteItem={(id) => setItems(items.filter((i) => i.id !== id))}
          onTogglePurchased={(id) =>
            setItems(items.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)))
          }
          c={c}
        />
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
      {showItemModal && activeCat && (
        <ItemModal
          c={c}
          category={activeCat}
          initial={editingItem}
          onClose={() => setShowItemModal(false)}
          onSave={(item) => {
            setItems((prev) => {
              const exists = prev.some((i) => i.id === item.id);
              return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
            });
            setShowItemModal(false);
          }}
        />
      )}
    </div>
  );
}
