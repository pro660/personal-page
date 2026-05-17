import './styles/SearchField.css';

export function SearchField({
  disabled = false,
  id,
  label,
  onChange,
  onClear,
  placeholder,
  value,
}) {
  return (
    <form className="search-field" onSubmit={(event) => event.preventDefault()} role="search">
      <label htmlFor={id}>{label}</label>
      <input
        aria-label={label}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <button aria-label="검색어 지우기" onClick={onClear} type="button">
          지우기
        </button>
      ) : null}
    </form>
  );
}
