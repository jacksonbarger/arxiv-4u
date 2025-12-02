'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { CATEGORY_LABELS } from '@/lib/keywords';
import { getPaperImage } from '@/lib/paperImages';
import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Avatar, AvatarGroup } from '@heroui/react';
import Image from 'next/image';
import { FileText, Bookmark, Pin } from 'lucide-react';

interface Demo4PaperCardProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onClick: () => void;
  onBookmarkClick: () => void;
  isBookmarked: boolean;
}

export function Demo4PaperCard({
  paper,
  categoryMatches = [],
  onClick,
  onBookmarkClick,
  isBookmarked,
}: Demo4PaperCardProps) {
  const topCategory = categoryMatches[0];
  const paperImage = getPaperImage(paper.id, categoryMatches.map(m => m.category), paper.title);

  return (
    <Card
      isPressable
      onPress={onClick}
      className="w-full h-full"
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        {topCategory && (
          <Chip color="primary" size="sm" variant="shadow">
            {CATEGORY_LABELS[topCategory.category]}
          </Chip>
        )}
      </CardHeader>
      <div className="relative w-full h-[200px]">
        <Image
          src={paperImage}
          alt={paper.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardBody className="overflow-visible py-4">
        <h4 className="font-bold text-large line-clamp-2 mb-2">{paper.title}</h4>
        <div className="flex items-center gap-2 mb-3">
          <AvatarGroup isBordered max={3} size="sm">
            {paper.authors.slice(0, 3).map((author, idx) => (
              <Avatar key={idx} name={author.name.charAt(0)} />
            ))}
          </AvatarGroup>
          <p className="text-small text-default-500 truncate">
            {paper.authors[0]?.name}
            {paper.authors.length > 1 && ` +${paper.authors.length - 1}`}
          </p>
        </div>
        <p className="text-small text-default-500 line-clamp-3">
          {paper.abstract}
        </p>
      </CardBody>
      <CardFooter className="justify-between">
        <Chip size="sm" variant="flat">
          {paper.primaryCategory}
        </Chip>
        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            as="a"
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            aria-label="Download PDF"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color={isBookmarked ? "primary" : "default"}
            variant={isBookmarked ? "solid" : "light"}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick();
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? <Bookmark className="w-4 h-4 fill-current" /> : <Pin className="w-4 h-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
