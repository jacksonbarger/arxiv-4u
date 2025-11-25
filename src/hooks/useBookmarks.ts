'use client';

import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'arxiv4u_bookmarks';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setBookmarkedIds(new Set(parsed));
      } catch {
        setBookmarkedIds(new Set());
      }
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = useCallback((ids: Set<string>) => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(ids)));
  }, []);

  const addBookmark = useCallback((paperId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.add(paperId);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const removeBookmark = useCallback((paperId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.delete(paperId);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const toggleBookmark = useCallback((paperId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(paperId)) {
        next.delete(paperId);
      } else {
        next.add(paperId);
      }
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const isBookmarked = useCallback((paperId: string) => {
    return bookmarkedIds.has(paperId);
  }, [bookmarkedIds]);

  const clearAllBookmarks = useCallback(() => {
    setBookmarkedIds(new Set());
    localStorage.removeItem(BOOKMARKS_KEY);
  }, []);

  return {
    bookmarkedIds,
    isLoaded,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    bookmarkCount: bookmarkedIds.size,
  };
}
