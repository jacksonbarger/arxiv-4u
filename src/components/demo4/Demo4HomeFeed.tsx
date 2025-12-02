'use client';

import { useState } from 'react';
import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { FilterState } from '../FilterPanel';
import { Demo4PaperCard } from './Demo4PaperCard';
import { Input, Button, Chip, Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem, Spinner } from '@heroui/react';
import { CATEGORY_LABELS } from '@/lib/keywords';
import { UserMenu } from '../ui/UserMenu';
import { NotificationBell } from '../ui/NotificationBell';
import { NotificationPanel } from '../ui/NotificationPanel';
import { Zap, Search, RefreshCw, Library, Settings, FileText } from 'lucide-react';

interface Demo4HomeFeedProps {
  papers: ArxivPaper[];
  categoryMatchesMap: Map<string, CategoryMatch[]>;
  categoryDistribution: Record<TopicCategory, number>;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onPaperClick: (paper: ArxivPaper) => void;
  onBookmarkToggle: (paperId: string) => void;
  isBookmarked: (paperId: string) => boolean;
  isLoading: boolean;
  onRefresh: () => void;
  error?: string | null;
  onNavClick: (item: 'home' | 'bookmarks' | 'settings') => void;
  bookmarkCount: number;
}

const ALL_CATEGORIES: TopicCategory[] = [
  'Computer Vision', 'Natural Language Processing', 'Machine Learning',
  'Robotics', 'Reinforcement Learning', 'Generative AI',
  'Multimodal Learning', 'Speech Recognition', 'AI Ethics & Safety', 'Theoretical ML',
];

export function Demo4HomeFeed({
  papers,
  categoryMatchesMap,
  categoryDistribution,
  filters,
  onFiltersChange,
  onPaperClick,
  onBookmarkToggle,
  isBookmarked,
  isLoading,
  onRefresh,
  error,
  onNavClick,
  bookmarkCount,
}: Demo4HomeFeedProps) {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const toggleCategory = (category: TopicCategory) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories: newCategories });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isBordered maxWidth="full">
        <NavbarBrand>
          <Avatar
            icon={<Zap className="w-6 h-6" />}
            classNames={{
              base: "bg-gradient-to-br from-indigo-500 to-pink-500",
              icon: "text-white",
            }}
          />
          <div className="ml-3">
            <p className="font-bold text-lg">Arxiv-4U</p>
            <p className="text-xs text-default-500">Research Platform</p>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Input
              classNames={{
                base: "max-w-full sm:max-w-[20rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              placeholder="Search papers..."
              size="sm"
              startContent={<Search className="w-4 h-4" />}
              type="search"
              value={filters.searchQuery}
              onValueChange={(value) => onFiltersChange({ ...filters, searchQuery: value })}
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={onRefresh}
              isLoading={isLoading}
              aria-label="Refresh papers"
            >
              {!isLoading && <RefreshCw className="w-5 h-5" />}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => onNavClick('bookmarks')}
              aria-label="View bookmarks"
              className="relative"
            >
              <Library className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => onNavClick('settings')}
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <UserMenu />
          </NavbarItem>
          <NavbarItem>
            <NotificationBell
              onOpenPanel={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
              isOpen={isNotificationPanelOpen}
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />

      {/* Category Chips */}
      <div className="border-b border-divider">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ALL_CATEGORIES.map((category) => {
              const isSelected = filters.selectedCategories.includes(category);
              const count = categoryDistribution[category] || 0;

              return (
                <Chip
                  key={category}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'solid' : 'flat'}
                  onClick={() => toggleCategory(category)}
                  className="cursor-pointer"
                >
                  {CATEGORY_LABELS[category]}
                  {count > 0 && ` (${count})`}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger rounded-lg">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Research</h2>
          <p className="text-default-500">
            {papers.length} paper{papers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" label="Loading papers..." />
          </div>
        ) : papers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <Demo4PaperCard
                key={paper.id}
                paper={paper}
                categoryMatches={categoryMatchesMap.get(paper.id)}
                onClick={() => onPaperClick(paper)}
                onBookmarkClick={() => onBookmarkToggle(paper.id)}
                isBookmarked={isBookmarked(paper.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-16 h-16 mb-4 text-default-300" />
            <h3 className="text-xl font-semibold mb-2">No papers found</h3>
            <p className="text-default-500">Try adjusting your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
