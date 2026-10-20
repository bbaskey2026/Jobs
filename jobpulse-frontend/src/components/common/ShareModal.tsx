import React, { useState, useRef } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Email as EmailIcon,
  Code as EmbedIcon,
  Check as CheckIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  organization?: string;
  slug?: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  title,
  organization,
  slug,
  url
}) => {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Compute absolute share URL
  const shareUrl = url || (
    typeof window !== 'undefined'
      ? slug
        ? `${window.location.origin}/jobs/${slug}`
        : window.location.href
      : ''
  );

  const shareText = organization
    ? `📢 ${title} - ${organization}. Official vacancy notice, eligibility & application details:`
    : `📢 ${title}. Official vacancy notice, eligibility & application details:`;

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="450" frameborder="0" title="${title}"></iframe>`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const dummy = document.createElement('input');
      dummy.value = shareUrl;
      document.body.appendChild(dummy);
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      setCopied(true);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setToastMessage('Embed code copied to clipboard!');
      setTimeout(() => setEmbedCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const shareChannels = [
    {
      name: 'Embed',
      icon: <EmbedIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />,
      bgColor: '#383838',
      hoverBg: '#484848',
      onClick: handleCopyEmbed
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />,
      bgColor: '#25D366',
      hoverBg: '#22BF5B',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />,
      bgColor: '#2AABEE',
      hoverBg: '#2299D6',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'X',
      icon: <TwitterIcon sx={{ fontSize: 26, color: '#FFFFFF' }} />,
      bgColor: '#000000',
      hoverBg: '#1A1A1A',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />,
      bgColor: '#1877F2',
      hoverBg: '#1464CC',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />,
      bgColor: '#0A66C2',
      hoverBg: '#0854A0',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: <EmailIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />,
      bgColor: '#0B72E7',
      hoverBg: '#095EC0',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    }
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#212121',
            color: '#FFFFFF',
            borderRadius: '16px',
            p: 0,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {/* Top Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              fontSize: '1rem',
              color: '#F1F1F1'
            }}
          >
            Share in a post
          </Typography>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#FFFFFF',
              p: 0.5,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' }
            }}
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* Opportunity Summary Card */}
        <Box sx={{ textAlign: 'center', px: 3, pt: 1, pb: 2.5 }}>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            sx={{
              bgcolor: '#FFFFFF',
              color: '#0F0F0F',
              fontWeight: 700,
              fontSize: '0.875rem',
              borderRadius: '24px',
              px: 3,
              py: 0.85,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#E5E5E5',
                boxShadow: 'none'
              }
            }}
          >
            Create post
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: '#AAAAAA',
              fontSize: '0.8125rem',
              mt: 1.5,
              fontWeight: 400
            }}
          >
            {organization ? `${organization} · Verified Notice` : 'Verified Job Gazette'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mx: 2.5 }} />

        {/* Share Channels Section */}
        <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#F1F1F1',
              fontWeight: 600,
              fontSize: '0.9375rem',
              mb: 2
            }}
          >
            Share
          </Typography>

          {/* Horizontal scrollable icons row with optional nav chevrons */}
          <Box sx={{ position: 'relative' }}>
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
            >
              {shareChannels.map((channel) => {
                const buttonContent = (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 64,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        bgcolor: channel.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                        border: channel.border || 'none',
                        transition: 'transform 0.15s ease, background-color 0.15s ease',
                        '&:hover': {
                          bgcolor: channel.hoverBg,
                          transform: 'scale(1.06)'
                        }
                      }}
                    >
                      {channel.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#F1F1F1',
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {channel.name}
                    </Typography>
                  </Box>
                );

                if (channel.onClick) {
                  return (
                    <Box key={channel.name} onClick={channel.onClick}>
                      {buttonContent}
                    </Box>
                  );
                }

                return (
                  <Box
                    key={channel.name}
                    component="a"
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    sx={{ textDecoration: 'none' }}
                  >
                    {buttonContent}
                  </Box>
                );
              })}
            </Box>

            {/* Scroll Right Chevron Arrow */}
            <IconButton
              onClick={() => scroll('right')}
              size="small"
              sx={{
                position: 'absolute',
                right: -10,
                top: 15,
                bgcolor: 'rgba(33, 33, 33, 0.9)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                '&:hover': { bgcolor: '#383838' }
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Bottom URL Pill Bar with Built-in Copy Button */}
        <Box sx={{ px: 3, pb: 3, pt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#0F0F0F',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              pl: 2.25,
              pr: 0.75,
              py: 0.65,
              gap: 1.5
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                color: '#AAAAAA',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {shareUrl}
            </Typography>

            <Button
              onClick={handleCopyLink}
              size="small"
              startIcon={copied ? <CheckIcon sx={{ fontSize: 16 }} /> : undefined}
              sx={{
                bgcolor: copied ? '#22C55E' : '#FFFFFF',
                color: copied ? '#FFFFFF' : '#0F0F0F',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                borderRadius: '20px',
                px: 2.25,
                py: 0.6,
                minWidth: '70px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: copied ? '#16A34A' : '#E5E5E5',
                  boxShadow: 'none'
                }
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={2500}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          sx={{
            bgcolor: '#0F0F0F',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            fontWeight: 600,
            '& .MuiAlert-icon': { color: '#22C55E' }
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
