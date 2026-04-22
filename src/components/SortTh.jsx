import { IconHtml } from "../utils/iconHtml";

export function SortTh({ label, sortKey, api }) {
  const active = api.state.listSort.key === sortKey;
  const dir = api.state.listSort.dir;
  const indicator = active ? (dir === "asc" ? "↑" : "↓") : <IconHtml html={api.icons.tableSortNeutral} />;
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className={`data-table__sort${active ? " is-active" : ""}`}
        data-list-sort={sortKey}
        aria-label={`Sort by ${label}${active ? `, ${dir === "asc" ? "ascending" : "descending"}` : ""}`}
      >
        {label}
        <span className="data-table__sort-arrow" aria-hidden="true">
          {indicator}
        </span>
      </button>
    </th>
  );
}
