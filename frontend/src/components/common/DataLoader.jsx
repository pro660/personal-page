import './styles/DataLoader.css';

export function DataLoader({ className = '' }) {
  return (
    <div className={`data-loader ${className}`.trim()} aria-hidden="true">
      <svg className="data-loader__cloud" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <filter id="data-loader-roundness">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
          </filter>
          <mask id="data-loader-shapes">
            <g fill="white">
              <polygon points="50 37.5 80 75 20 75 50 37.5" />
              <circle cx="20" cy="60" r="15" />
              <circle cx="80" cy="60" r="15" />
              <g>
                <circle cx="20" cy="60" r="15" />
                <circle cx="20" cy="60" r="15" />
                <circle cx="20" cy="60" r="15" />
              </g>
            </g>
          </mask>
          <mask id="data-loader-clipping" clipPathUnits="userSpaceOnUse">
            <g className="data-loader__lines" filter="url(#data-loader-roundness)">
              <g mask="url(#data-loader-shapes)" stroke="white">
                {[
                  -40, -31, -22, -13, -4, 5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 131, 140,
                ].map((y) => (
                  <line key={y} x1="-50" y1={y} x2="150" y2={y} />
                ))}
              </g>
            </g>
          </mask>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="0" ry="0" mask="url(#data-loader-clipping)" />
      </svg>
    </div>
  );
}
