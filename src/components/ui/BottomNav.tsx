'use client';

export type NavItem = 'home' | 'categories' | 'search' | 'bookmarks' | 'settings';

interface BottomNavProps {
  activeItem: NavItem;
  onItemClick: (item: NavItem) => void;
  bookmarkCount?: number;
}

const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    id: 'search',
    label: 'Search',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export function BottomNav({ activeItem, onItemClick, bookmarkCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item.id)}
              className="relative flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all"
              style={{ color: isActive ? '#4A5568' : '#718096' }}
            >
              <div className="relative">
                {item.icon}
                {/* Badge for bookmarks */}
                {item.id === 'bookmarks' && bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: '#9EDCE1' }}>
                    {bookmarkCount > 9 ? '9+' : bookmarkCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 rounded-full" style={{ backgroundColor: '#9EDCE1' }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
