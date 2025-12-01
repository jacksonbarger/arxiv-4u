'use client';

import { useState } from 'react';
import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { useToast } from '@/components/ui/Toast';

interface ShareButtonsProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  variant?: 'default' | 'compact';
}

/**
 * Generate share text with insights
 */
function generateShareText(paper: ArxivPaper, categoryMatches?: CategoryMatch[]): {
  x: string;
  linkedin: string;
  reddit: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  email: { subject: string; body: string };
} {
  const commercialScore = categoryMatches && categoryMatches[0] ? categoryMatches[0].score : 50;
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const xText = `🚀 Fascinating AI research: "${paper.title.slice(0, 100)}${paper.title.length > 100 ? '...' : ''}"

Commercial Potential: ${commercialScore}/100

Read insights on @Arxiv4U:`;

  const linkedinText = `I just discovered this interesting research paper on Arxiv-4U:

"${paper.title}"

Commercial Score: ${commercialScore}/100

The platform provides marketing insights and business plan generation for academic papers - really useful for entrepreneurs and researchers looking to commercialize their work!

Check it out: ${url}

#AI #Research #Innovation #Entrepreneurship`;

  const redditText = `🚀 ${paper.title}

Commercial Potential: ${commercialScore}/100

Found this on Arxiv-4U - they provide AI-powered business insights for research papers. Pretty cool tool for researchers looking to commercialize their work!`;

  const whatsappText = `🚀 Check out this research paper: "${paper.title.slice(0, 80)}${paper.title.length > 80 ? '...' : ''}"

Commercial Score: ${commercialScore}/100

See insights: ${url}`;

  const telegramText = whatsappText; // Similar format for Telegram

  const facebookText = `Fascinating AI research I found on Arxiv-4U!

"${paper.title}"

Commercial Potential Score: ${commercialScore}/100

This platform provides marketing insights and business plan generation for academic papers. Check it out!`;

  const emailSubject = `Interesting research: ${paper.title.slice(0, 60)}${paper.title.length > 60 ? '...' : ''}`;

  const emailBody = `Hi,

I thought you might find this research interesting:

${paper.title}

Authors: ${paper.authors.slice(0, 3).map(a => a.name).join(', ')}${paper.authors.length > 3 ? ' et al.' : ''}

Commercial Potential Score: ${commercialScore}/100

Arxiv-4U provides AI-powered insights for turning research into business opportunities. Check it out:
${url}

Best,`;

  return {
    x: xText,
    linkedin: linkedinText,
    reddit: redditText,
    whatsapp: whatsappText,
    telegram: telegramText,
    facebook: facebookText,
    email: { subject: emailSubject, body: emailBody },
  };
}

export function ShareButtons({ paper, categoryMatches = [], variant = 'default' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { showToast } = useToast();
  const shareText = generateShareText(paper, categoryMatches);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleXShare = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.x)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
    showToast('Opening X (Twitter)...', 'info');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
    showToast('Opening LinkedIn...', 'info');
  };

  const handleRedditShare = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareText.reddit)}`;
    window.open(redditUrl, '_blank', 'width=550,height=600');
    showToast('Opening Reddit...', 'info');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText.whatsapp + ' ' + currentUrl)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp...', 'info');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText.telegram)}`;
    window.open(telegramUrl, '_blank');
    showToast('Opening Telegram...', 'info');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText.facebook)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    showToast('Opening Facebook...', 'info');
  };

  const handleEmailShare = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareText.email.subject)}&body=${encodeURIComponent(shareText.email.body)}`;
    window.location.href = mailtoUrl;
    showToast('Opening email client...', 'info');
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Share"
        >
          <svg className="w-5 h-5" style={{ color: '#718096' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>

        {showShareMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg z-20 overflow-hidden max-h-96 overflow-y-auto"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <button
                onClick={() => { handleXShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">𝕏</span>
                Share on X
              </button>
              <button
                onClick={() => { handleLinkedInShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">in</span>
                Share on LinkedIn
              </button>
              <button
                onClick={() => { handleRedditShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">🤖</span>
                Share on Reddit
              </button>
              <button
                onClick={() => { handleFacebookShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">f</span>
                Share on Facebook
              </button>
              <button
                onClick={() => { handleWhatsAppShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">💬</span>
                Share on WhatsApp
              </button>
              <button
                onClick={() => { handleTelegramShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">✈️</span>
                Share on Telegram
              </button>
              <button
                onClick={() => { handleEmailShare(); setShowShareMenu(false); }}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                style={{ color: '#4A5568' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-lg">✉️</span>
                Share via Email
              </button>
              <div className="border-t" style={{ borderColor: '#E2E8F0' }}>
                <button
                  onClick={() => { handleCopyLink(); setShowShareMenu(false); }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                  style={{ color: '#4A5568' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {copied ? (
                    <>
                      <span className="text-lg">✓</span>
                      <span style={{ color: '#10B981' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🔗</span>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-8 animate-fadeIn"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F7FAFC 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}
    >
      <h3 className="text-base font-bold mb-6 flex items-center gap-3" style={{ color: '#2D3748' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #9EDCE1 0%, #C0E5E8 100%)',
            boxShadow: '0 2px 8px rgba(158, 220, 225, 0.3)'
          }}
        >
          <svg className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </div>
        Share This Research
      </h3>

      <div className="grid grid-cols-2 gap-3.5">
        {/* X (Twitter) */}
        <button
          onClick={handleXShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          }}
        >
          <span className="text-lg font-bold">𝕏</span>
          <span className="tracking-wide">X</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#0A66C2',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(10, 102, 194, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(10, 102, 194, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(10, 102, 194, 0.2)';
          }}
        >
          <span className="text-lg font-bold">in</span>
          <span className="tracking-wide">LinkedIn</span>
        </button>

        {/* Reddit */}
        <button
          onClick={handleRedditShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#FF4500',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(255, 69, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 69, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 69, 0, 0.2)';
          }}
        >
          <span className="text-lg">🤖</span>
          <span className="tracking-wide">Reddit</span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#1877F2',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(24, 119, 242, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(24, 119, 242, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 119, 242, 0.2)';
          }}
        >
          <span className="text-lg font-bold">f</span>
          <span className="tracking-wide">Facebook</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 211, 102, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 211, 102, 0.2)';
          }}
        >
          <span className="text-lg">💬</span>
          <span className="tracking-wide">WhatsApp</span>
        </button>

        {/* Telegram */}
        <button
          onClick={handleTelegramShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#0088CC',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 136, 204, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 136, 204, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 136, 204, 0.2)';
          }}
        >
          <span className="text-lg">✈️</span>
          <span className="tracking-wide">Telegram</span>
        </button>

        {/* Email */}
        <button
          onClick={handleEmailShare}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#4A5568',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#CBD5E0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <span className="text-lg">✉️</span>
          <span className="tracking-wide">Email</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="group relative px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            backgroundColor: copied ? '#10B981' : '#FFFFFF',
            color: copied ? '#FFFFFF' : '#4A5568',
            border: `1.5px solid ${copied ? '#10B981' : '#E2E8F0'}`,
            boxShadow: copied ? '0 2px 8px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = '#CBD5E0';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }
          }}
        >
          {copied ? (
            <>
              <span className="text-lg">✓</span>
              <span className="tracking-wide">Copied!</span>
            </>
          ) : (
            <>
              <span className="text-lg">🔗</span>
              <span className="tracking-wide">Copy Link</span>
            </>
          )}
        </button>
      </div>

      <div
        className="mt-6 pt-4 text-center"
        style={{ borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}
      >
        <p className="text-xs font-medium" style={{ color: '#718096' }}>
          ✨ Help others discover valuable research insights
        </p>
      </div>
    </div>
  );
}
