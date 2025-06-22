import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "collapsed_teams";

export function useCollapsedState(teamId) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[teamId] ?? false;
    }
    return false;
  });

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[teamId] = isCollapsed;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
  }, [isCollapsed, teamId]);

  return [isCollapsed, setIsCollapsed];
}
