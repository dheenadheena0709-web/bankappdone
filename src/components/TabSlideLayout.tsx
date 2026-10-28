import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigationType, Location } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const TAB_RANKS: Record<string, number> = {
  '/home': 0,
  '/accounts': 0,
  '/payments': 1,
  '/people-and-bills': 1,
  '/move-money': 1,
  '/pay-and-transfer': 1,
  '/business': 2,
  '/investment': 2,
  '/support': 3,
  '/profile': 3,
  '/more': 4,
  '/mpassbook': 4,
};

export const getTabRank = (path: string): number => {
  if (TAB_RANKS[path] !== undefined) return TAB_RANKS[path];
  for (const [route, rank] of Object.entries(TAB_RANKS)) {
    if (path.startsWith(route)) return rank;
  }
  return -1;
};

export const isTabRoute = (path: string): boolean => {
  return getTabRank(path) !== -1;
};

interface TabSlideLayoutProps {
  children: (location: Location) => React.ReactNode;
}

export const TabSlideLayout: React.FC<TabSlideLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navType = useNavigationType();

  const [currentLocation, setCurrentLocation] = useState<Location>(location);
  const [previousLocation, setPreviousLocation] = useState<Location | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const prevLocationRef = useRef<Location>(location);

  useEffect(() => {
    if (location.pathname === prevLocationRef.current.pathname && location.search === prevLocationRef.current.search) {
      return;
    }

    const oldPath = prevLocationRef.current.pathname;
    const newPath = location.pathname;

    const oldRank = getTabRank(oldPath);
    const newRank = getTabRank(newPath);

    // Determine slide direction:
    // When switching tabs, new page slides right-to-left ('forward') if rank increases or standard push.
    // When going back, new page slides left-to-right ('backward') if rank decreases or pop/back action.
    let slideDirection: 'forward' | 'backward' = 'forward';

    if (navType === 'POP') {
      slideDirection = 'backward';
    } else if (oldRank !== -1 && newRank !== -1) {
      slideDirection = newRank >= oldRank ? 'forward' : 'backward';
    } else if (oldRank === -1 && newRank !== -1) {
      // Returning to a main tab from a sub-detail page
      slideDirection = 'backward';
    } else {
      slideDirection = 'forward';
    }

    setDirection(slideDirection);
    setPreviousLocation(prevLocationRef.current);
    setCurrentLocation(location);
    setIsTransitioning(true);

    prevLocationRef.current = location;

    // 350ms duration for native iOS feel with easeOutCubic curve
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousLocation(null);
    }, 350);

    return () => clearTimeout(timer);
  }, [location, navType]);

  const showBottomNav = isTabRoute(location.pathname);

  return (
    <div className="relative w-full min-h-screen bg-[#F5F5F5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden flex flex-col justify-between transition-colors duration-200">
      {/* Sliding Panes Container */}
      <div className="relative w-full flex-1 overflow-x-hidden">
        {/* Outgoing view during the 350ms transition (no hard cut) */}
        {isTransitioning && previousLocation && (
          <div
            key={`prev-${previousLocation.pathname}`}
            className={`absolute inset-0 w-full min-h-full z-10 pointer-events-none transform-gpu ${
              direction === 'forward'
                ? 'tab-slide-pane-out-left'
                : 'tab-slide-pane-out-right'
            }`}
          >
            {children(previousLocation)}
          </div>
        )}

        {/* Incoming view during 350ms transition, or static view when settled */}
        <div
          key={`curr-${currentLocation.pathname}`}
          className={`w-full min-h-full transform-gpu ${
            isTransitioning
              ? `relative z-20 ${
                  direction === 'forward'
                    ? 'tab-slide-pane-in-right'
                    : 'tab-slide-pane-in-left'
                }`
              : 'relative z-10'
          }`}
        >
          {children(currentLocation)}
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR: Stationary, persistent across all tab slides */}
      {showBottomNav && (
        <div className="pointer-events-auto">
          <BottomNav />
        </div>
      )}
    </div>
  );
};
