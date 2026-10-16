import React from 'react';
import { Chapter, MapViewMode } from '../types/game';

interface ChapterMapScreenProps {
  chapters: Chapter[];
  completedChapterIds: string[];
  viewMode: MapViewMode;
  onToggleViewMode: (mode: MapViewMode) => void;
  onSelectChapter: (chapterId: string) => void;
}

export const ChapterMapScreen: React.FC<ChapterMapScreenProps> = ({
  chapters,
  completedChapterIds,
  viewMode,
  onToggleViewMode,
  onSelectChapter
}) => {
  return (
    <div className="screen-container">
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="screen-title">Learning Map</h1>
          <p className="screen-subtitle">
            Choose an available module to explore Alex’s pension journey.
          </p>
        </div>

        {/* View Mode Toggle: Map vs List */}
        <div className="map-nav-toggle" role="group" aria-label="Chapter map display format">
          <button
            type="button"
            className={`map-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('map')}
            aria-pressed={viewMode === 'map'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Visual Map
          </button>
          <button
            type="button"
            className={`map-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('list')}
            aria-pressed={viewMode === 'list'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List View
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        /* Visual Map Mode */
        <div className="map-visual-track" role="region" aria-label="Visual chapter progression pathway">
          {chapters.map((chapter) => {
            const isCompleted = completedChapterIds.includes(chapter.id);
            const isPlayable = chapter.isPlayable;

            return (
              <div
                key={chapter.id}
                className={`map-chapter-card ${isPlayable ? 'playable' : 'locked'}`}
                style={{
                  borderLeft: isPlayable
                    ? '6px solid var(--teal-primary)'
                    : '6px solid var(--border-strong)'
                }}
              >
                <div
                  className={`chapter-number-badge ${
                    isCompleted ? 'completed' : isPlayable ? 'playable' : 'locked'
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    chapter.number
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-navy-muted)' }}>
                      Chapter {chapter.number}
                    </span>

                    {isCompleted && (
                      <span className="card-header-tag tag-teal" style={{ margin: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Completed
                      </span>
                    )}

                    {!isPlayable && (
                      <span className="card-header-tag tag-neutral" style={{ margin: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Coming later
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy-dark)', marginBottom: '0.35rem' }}>
                    {chapter.title}
                  </h2>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-navy-body)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    {chapter.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {isPlayable ? (
                      <button
                        type="button"
                        className="btn btn-teal"
                        onClick={() => onSelectChapter(chapter.id)}
                        aria-label={`${isCompleted ? 'Replay' : 'Start'} Chapter ${chapter.number}: ${chapter.title}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        {isCompleted ? 'Review Chapter' : 'Start Chapter'}
                      </button>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-navy-muted)',
                          fontStyle: 'italic',
                          padding: '0.4rem 0'
                        }}
                      >
                        In development for upcoming releases. No playable preview yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Accessible List View Mode */
        <div className="card" role="region" aria-label="Accessible chapter list alternative">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {chapters.map((chapter) => {
              const isCompleted = completedChapterIds.includes(chapter.id);
              const isPlayable = chapter.isPlayable;

              return (
                <li
                  key={chapter.id}
                  style={{
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--teal-primary)' }}>
                      Chapter {chapter.number}
                    </span>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-navy-dark)', margin: 0 }}>
                      {chapter.title}
                    </h2>
                    {isCompleted ? (
                      <span className="card-header-tag tag-teal" style={{ margin: 0 }}>
                        Status: Completed
                      </span>
                    ) : isPlayable ? (
                      <span className="card-header-tag tag-yellow" style={{ margin: 0 }}>
                        Status: Available
                      </span>
                    ) : (
                      <span className="card-header-tag tag-neutral" style={{ margin: 0 }}>
                        Status: Coming later
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-navy-body)' }}>
                    {chapter.summary}
                  </p>

                  <div style={{ marginTop: '0.25rem' }}>
                    {isPlayable ? (
                      <button
                        type="button"
                        className="btn btn-teal btn-sm"
                        onClick={() => onSelectChapter(chapter.id)}
                      >
                        {isCompleted ? 'Review Chapter 1' : 'Start Chapter 1'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)' }}>
                        Planned module (Coming later)
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
