"use client";

import React, { useState, useMemo } from "react";
import { Plus, X, Star, Search, Trash2, Tag } from "lucide-react";

// ---------- 기본 데이터 ----------

const STARTER_CATEGORIES = [
  {
    id: "wine",
    name: "와인",
    color: "#7B2D3F",
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
    color: "#6B5FA6",
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
    color: "#B8863B",
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
    color: "#3E6B8A",
    fields: [
      {
        key: "genre",
        label: "책 종류",
        type: "select",
        options: [
          "소설",
          "에세이",
          "인문",
          "자기계발",
          "경제/경영",
          "과학",
          "시/희곡",
          "만화",
          "아동",
          "기타",
        ],
      },
      { key: "recommender", label: "추천인", type: "text" },
      { key: "rating", label: "평점", type: "rating" },
      { key: "price", label: "가격(원)", type: "number" },
    ],
  },
];

const STARTER_ITEMS = [
  {
    id: "i1",
    categoryId: "wine",
    name: "샤또 무똥 카데 루즈",
    memo: "",
    values: {
      recommender: "민지",
      rating: 4,
      price: 45000,
      when: "스테이크 먹을 때",
      taste: "바디감 묵직, 타닌 강함",
    },
  },
  {
    id: "i2",
    categoryId: "wine",
    name: "키안티 클라시코",
    memo: "",
    values: {
      recommender: "회사 와인모임",
      rating: 3,
      price: 32000,
      when: "가벼운 파스타 안주",
      taste: "산미 있음, 체리향",
    },
  },
  {
    id: "i3",
    categoryId: "lens",
    name: "글램룩 그레이",
    memo: "",
    values: {
      brand: "글램룩",
      colorName: "그레이",
      size: "14.2mm",
      rating: 5,
    },
  },
  {
    id: "i4",
    categoryId: "cheese",
    name: "브리 드 뫼",
    memo: "",
    values: {
      cheeseType: "연성치즈(까망베르류)",
      wineFit: "샴페인, 가벼운 화이트와인",
      foodFit: "바게트, 견과류, 꿀",
      rating: 4,
      price: 18000,
    },
  },
  {
    id: "i5",
    categoryId: "book",
    name: "달러구트 꿈 백화점",
    memo: "",
    values: {
      genre: "소설",
      recommender: "인스타 북튜버",
      rating: 4,
      price: 14800,
    },
  },
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

function StarRating({ value = 0, onChange, size = 16, readOnly = false }) {
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
            fill={s <= value ? "#C9A15A" : "none"}
            color={s <= value ? "#C9A15A" : "#B8AFA0"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function CategoryTab({ cat, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left px-4 py-3 rounded-md transition-colors"
      style={{
        backgroundColor: active ? "#FBF8F3" : "transparent",
        borderLeft: `3px solid ${active ? cat.color : "transparent"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[15px]"
          style={{
            fontFamily: "'Fraunces', serif",
            color: active ? "#2A241C" : "#6B6255",
            fontWeight: active ? 600 : 500,
          }}
        >
          {cat.name}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: active ? cat.color : "#E9E3D8",
            color: active ? "#fff" : "#8A8175",
          }}
        >
          {count}
        </span>
      </div>
    </button>
  );
}

// ---------- 카테고리 추가 모달 ----------

function AddCategoryModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4C7A6B");
  const [fields, setFields] = useState([{ key: nextId("f"), label: "", type: "text" }]);

  const addField = () =>
    setFields([...fields, { key: nextId("f"), label: "", type: "text" }]);
  const updateField = (idx, patch) =>
    setFields(fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));

  const canSave = name.trim() && fields.some((f) => f.label.trim());

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-lg p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#FBF8F3" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#2A241C" }}
          >
            새 카테고리 만들기
          </h3>
          <button onClick={onClose}>
            <X size={18} color="#8A8175" />
          </button>
        </div>

        <label className="text-xs uppercase tracking-wide" style={{ color: "#8A8175" }}>
          카테고리 이름
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 향수, 조명, 텀블러..."
          className="w-full mt-1 mb-4 px-3 py-2 rounded border text-sm"
          style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
        />

        <label className="text-xs uppercase tracking-wide" style={{ color: "#8A8175" }}>
          색상
        </label>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-9 h-9 rounded cursor-pointer border"
            style={{ borderColor: "#DCD4C4" }}
          />
          <span className="text-sm" style={{ color: "#6B6255" }}>
            탭과 카드에 사용할 포인트 컬러예요
          </span>
        </div>

        <label className="text-xs uppercase tracking-wide" style={{ color: "#8A8175" }}>
          저장할 항목들
        </label>
        <div className="mt-2 space-y-2">
          {fields.map((f, idx) => (
            <div key={f.key}>
              <div className="flex gap-2 items-center">
                <input
                  value={f.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                  placeholder="항목 이름 (예: 브랜드)"
                  className="flex-1 px-2 py-1.5 rounded border text-sm"
                  style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                />
                <select
                  value={f.type}
                  onChange={(e) => updateField(idx, { type: e.target.value })}
                  className="px-2 py-1.5 rounded border text-sm"
                  style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeField(idx)} disabled={fields.length === 1}>
                  <Trash2 size={15} color={fields.length === 1 ? "#D8D2C4" : "#B0685F"} />
                </button>
              </div>
              {f.type === "select" && (
                <input
                  value={(f.options || []).join(", ")}
                  onChange={(e) =>
                    updateField(idx, {
                      options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="선택지를 쉼표로 구분해서 입력 (예: 소설, 에세이, 인문)"
                  className="w-full mt-1 px-2 py-1.5 rounded border text-xs"
                  style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addField}
          className="mt-3 text-sm flex items-center gap-1"
          style={{ color: "#4C7A6B" }}
        >
          <Plus size={14} /> 항목 추가
        </button>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded text-sm"
            style={{ backgroundColor: "#EFE9DC", color: "#6B6255" }}
          >
            취소
          </button>
          <button
            disabled={!canSave}
            onClick={() =>
              onCreate({
                id: nextId("cat"),
                name: name.trim(),
                color,
                fields: fields.filter((f) => f.label.trim()),
              })
            }
            className="flex-1 py-2 rounded text-sm text-white"
            style={{ backgroundColor: canSave ? "#2A241C" : "#C8C0B0" }}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 아이템 추가 모달 ----------

function AddItemModal({ category, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [values, setValues] = useState({});

  const setV = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-lg p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#FBF8F3" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#2A241C" }}>
            {category.name}에 새 항목 추가
          </h3>
          <button onClick={onClose}>
            <X size={18} color="#8A8175" />
          </button>
        </div>

        <label className="text-xs uppercase tracking-wide" style={{ color: "#8A8175" }}>
          이름
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="제품/항목 이름"
          className="w-full mt-1 mb-4 px-3 py-2 rounded border text-sm"
          style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
        />

        <div className="space-y-4">
          {category.fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-wide" style={{ color: "#8A8175" }}>
                {f.label}
              </label>
              <div className="mt-1">
                {f.type === "rating" ? (
                  <StarRating value={values[f.key] || 0} onChange={(v) => setV(f.key, v)} size={20} />
                ) : f.type === "number" ? (
                  <input
                    type="number"
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                  />
                ) : f.type === "select" && f.options && f.options.length > 0 ? (
                  <select
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                  >
                    <option value="">선택 안 함</option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={values[f.key] || ""}
                    onChange={(e) => setV(f.key, e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ borderColor: "#DCD4C4", backgroundColor: "#fff" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded text-sm"
            style={{ backgroundColor: "#EFE9DC", color: "#6B6255" }}
          >
            취소
          </button>
          <button
            disabled={!name.trim()}
            onClick={() =>
              onCreate({
                id: nextId("item"),
                categoryId: category.id,
                name: name.trim(),
                memo: "",
                values,
              })
            }
            className="flex-1 py-2 rounded text-sm text-white"
            style={{ backgroundColor: name.trim() ? "#2A241C" : "#C8C0B0" }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- 아이템 카드 ----------

function ItemCard({ item, category, onDelete }) {
  return (
    <div
      className="relative rounded-md p-4 bg-white"
      style={{
        border: "1px solid #E9E3D8",
        borderTop: `3px solid ${category.color}`,
      }}
    >
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 hover:opacity-100"
        style={{ transition: "opacity .15s" }}
      >
        <Trash2 size={14} color="#B0685F" />
      </button>
      <h4
        style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: "#2A241C" }}
        className="pr-5 mb-2"
      >
        {item.name}
      </h4>
      <div className="space-y-1">
        {category.fields.map((f) => {
          const v = item.values[f.key];
          if (v === undefined || v === "") return null;
          return (
            <div key={f.key} className="flex items-baseline gap-2 text-sm">
              <span style={{ color: "#A39B8C", minWidth: 72, fontSize: 12 }}>{f.label}</span>
              {f.type === "rating" ? (
                <StarRating value={Number(v)} readOnly size={13} />
              ) : (
                <span style={{ color: "#4A4238" }}>
                  {f.type === "number" ? Number(v).toLocaleString() : v}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 메인 앱 ----------

export default function WishlistApp() {
  const [categories, setCategories] = useState(STARTER_CATEGORIES);
  const [items, setItems] = useState(STARTER_ITEMS);
  const [activeCatId, setActiveCatId] = useState(STARTER_CATEGORIES[0].id);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectFilters, setSelectFilters] = useState({});

  const activeCat = categories.find((c) => c.id === activeCatId);

  const filteredItems = useMemo(() => {
    return items
      .filter((it) => it.categoryId === activeCatId)
      .filter((it) => {
        if (!search.trim()) return true;
        const hay = [it.name, ...Object.values(it.values || {})].join(" ").toLowerCase();
        return hay.includes(search.toLowerCase());
      })
      .filter((it) => {
        const ratingField = activeCat?.fields.find((f) => f.type === "rating");
        if (!ratingField || minRating === 0) return true;
        return Number(it.values[ratingField.key] || 0) >= minRating;
      })
      .filter((it) => {
        return Object.entries(selectFilters).every(([key, val]) => {
          if (!val) return true;
          return it.values[key] === val;
        });
      });
  }, [items, activeCatId, search, minRating, selectFilters, activeCat]);

  const ratingFieldExists = activeCat?.fields.some((f) => f.type === "rating");

  return (
    <div
      className="w-full min-h-[600px] flex"
      style={{
        backgroundColor: "#F5F1E8",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* 사이드바 */}
      <div className="w-48 shrink-0 p-4 flex flex-col" style={{ borderRight: "1px solid #E9E3D8" }}>
        <div className="flex items-center gap-1.5 mb-6 px-1">
          <Tag size={16} color="#2A241C" />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: "#2A241C" }}>
            내 위시리스트
          </span>
        </div>
        <div className="space-y-1">
          {categories.map((cat) => (
            <CategoryTab
              key={cat.id}
              cat={cat}
              active={cat.id === activeCatId}
              onClick={() => {
                setActiveCatId(cat.id);
                setSearch("");
                setMinRating(0);
                setSelectFilters({});
              }}
              count={items.filter((i) => i.categoryId === cat.id).length}
            />
          ))}
        </div>
        <button
          onClick={() => setShowAddCat(true)}
          className="mt-4 flex items-center gap-1.5 text-sm px-2 py-2"
          style={{ color: "#6B6255" }}
        >
          <Plus size={14} /> 카테고리 추가
        </button>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 p-6">
        {activeCat && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#2A241C",
                }}
              >
                {activeCat.name}
              </h2>
              <button
                onClick={() => setShowAddItem(true)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded text-white"
                style={{ backgroundColor: activeCat.color }}
              >
                <Plus size={14} /> 항목 추가
              </button>
            </div>

            {/* 필터 바 */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-1 min-w-[180px]"
                style={{ backgroundColor: "#fff", border: "1px solid #E9E3D8" }}
              >
                <Search size={14} color="#A39B8C" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="이름, 추천인, 메모 검색..."
                  className="text-sm outline-none flex-1"
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
              {ratingFieldExists && (
                <div
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
                  style={{ backgroundColor: "#fff", border: "1px solid #E9E3D8" }}
                >
                  <span className="text-xs" style={{ color: "#8A8175" }}>
                    최소 평점
                  </span>
                  <StarRating value={minRating} onChange={(v) => setMinRating(v === minRating ? 0 : v)} size={15} />
                </div>
              )}
              {activeCat.fields
                .filter((f) => f.type === "select" && f.options && f.options.length > 0)
                .map((f) => (
                  <select
                    key={f.key}
                    value={selectFilters[f.key] || ""}
                    onChange={(e) =>
                      setSelectFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className="px-2.5 py-1.5 rounded-md text-sm"
                    style={{ backgroundColor: "#fff", border: "1px solid #E9E3D8", color: "#4A4238" }}
                  >
                    <option value="">{f.label} 전체</option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ))}
            </div>

            {/* 아이템 그리드 */}
            {filteredItems.length === 0 ? (
              <div
                className="text-center py-16 rounded-md"
                style={{ border: "1px dashed #DCD4C4", color: "#A39B8C" }}
              >
                아직 저장된 항목이 없어요. "항목 추가"로 첫 항목을 채워보세요.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    category={activeCat}
                    onDelete={() => setItems(items.filter((i) => i.id !== item.id))}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showAddCat && (
        <AddCategoryModal
          onClose={() => setShowAddCat(false)}
          onCreate={(cat) => {
            setCategories([...categories, cat]);
            setActiveCatId(cat.id);
            setShowAddCat(false);
          }}
        />
      )}
      {showAddItem && activeCat && (
        <AddItemModal
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
