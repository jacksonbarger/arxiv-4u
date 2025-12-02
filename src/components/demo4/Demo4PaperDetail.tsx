'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { getPaperImage } from '@/lib/paperImages';
import { Card, CardHeader, CardBody, Button, Chip, Avatar, AvatarGroup, Divider } from '@heroui/react';
import Image from 'next/image';
import { CATEGORY_LABELS } from '@/lib/keywords';
import { PaperTLDR } from '../PaperTLDR';
import { RelatedPapers } from '../RelatedPapers';
import { ShareButtons } from '../ShareButtons';
import { Bookmark, Pin, Download, ExternalLink } from 'lucide-react';

interface Demo4PaperDetailProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onBack: () => void;
  onBookmarkToggle: () => void;
  isBookmarked: boolean;
  allPapers: ArxivPaper[];
  categoryMatchesMap: Map<string, CategoryMatch[]>;
  onPaperClick: (paper: ArxivPaper) => void;
  isBookmarkedFn: (paperId: string) => boolean;
  onBookmarkToggleFn: (paperId: string) => void;
}

export function Demo4PaperDetail({
  paper,
  categoryMatches = [],
  onBack,
  onBookmarkToggle,
  isBookmarked,
  allPapers,
  categoryMatchesMap,
  onPaperClick,
  isBookmarkedFn,
  onBookmarkToggleFn,
}: Demo4PaperDetailProps) {
  const paperImage = getPaperImage(paper.id, categoryMatches.map(m => m.category), paper.title);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button color="default" variant="flat" onPress={onBack} startContent={<span>←</span>}>
            Back
          </Button>
          <div className="flex gap-2">
            <ShareButtons url={paper.arxivUrl} title={paper.title} />
            <Button
              color={isBookmarked ? "primary" : "default"}
              variant={isBookmarked ? "solid" : "flat"}
              isIconOnly
              onPress={onBookmarkToggle}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? <Bookmark className="w-5 h-5 fill-current" /> : <Pin className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative h-80">
        <Image
          src={paperImage}
          alt={paper.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <main className="container mx-auto px-6 max-w-4xl -mt-20 relative z-10">
        <Card className="p-6 mb-8">
          <CardHeader className="flex-col items-start gap-3 pb-6">
            <div className="flex flex-wrap gap-2">
              {categoryMatches.slice(0, 3).map((match) => (
                <Chip key={match.category} color="primary">{CATEGORY_LABELS[match.category]}</Chip>
              ))}
            </div>
            <h1 className="text-4xl font-bold">{paper.title}</h1>
            <div className="flex items-center gap-4">
              <Chip variant="flat">{paper.primaryCategory}</Chip>
              <span className="text-small text-default-500">
                {new Date(paper.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-xl font-bold">Authors</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-wrap gap-4">
              {paper.authors.map((author, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Avatar name={author.name.charAt(0)} />
                  <div>
                    <p className="text-sm font-semibold">{author.name}</p>
                    {author.affiliation && <p className="text-xs text-default-500">{author.affiliation}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <PaperTLDR paper={paper} />

        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-xl font-bold">Abstract</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="leading-relaxed">{paper.abstract}</p>
          </CardBody>
        </Card>

        <Card className="mb-8">
          <CardBody className="flex-row gap-4">
            <Button
              color="primary"
              size="lg"
              className="flex-1"
              as="a"
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              startContent={<Download className="w-5 h-5" />}
            >
              Download PDF
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="flex-1"
              as="a"
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              startContent={<ExternalLink className="w-5 h-5" />}
            >
              View on arXiv
            </Button>
          </CardBody>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Papers</h2>
          <RelatedPapers
            currentPaper={paper}
            allPapers={allPapers}
            categoryMatchesMap={categoryMatchesMap}
            onPaperClick={onPaperClick}
            isBookmarked={isBookmarkedFn}
            onBookmarkToggle={onBookmarkToggleFn}
          />
        </div>
      </main>
    </div>
  );
}
