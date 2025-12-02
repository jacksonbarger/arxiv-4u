'use client';

import { ArxivPaper } from '@/types/arxiv';
import { Demo4PaperCard } from './Demo4PaperCard';
import { Button, Card, CardBody } from '@heroui/react';
import { Library } from 'lucide-react';

interface Demo4BookmarksProps {
  papers: ArxivPaper[];
  onPaperClick: (paper: ArxivPaper) => void;
  onBookmarkToggle: (paperId: string) => void;
  onBack: () => void;
}

export function Demo4Bookmarks({ papers, onPaperClick, onBookmarkToggle, onBack }: Demo4BookmarksProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button color="default" variant="flat" onPress={onBack} startContent={<span>←</span>}>
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Saved Papers</h1>
            <p className="text-sm text-default-500">{papers.length} paper{papers.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {papers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <Demo4PaperCard
                key={paper.id}
                paper={paper}
                onClick={() => onPaperClick(paper)}
                onBookmarkClick={() => onBookmarkToggle(paper.id)}
                isBookmarked={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-20">
              <Library className="w-16 h-16 mx-auto mb-4 text-default-300" />
              <h3 className="text-xl font-semibold mb-2">No saved papers yet</h3>
              <p className="text-default-500 mb-6">Start bookmarking papers to read them later</p>
              <Button color="primary" onPress={onBack}>Explore Papers</Button>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}
