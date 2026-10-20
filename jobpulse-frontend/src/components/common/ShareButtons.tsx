import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Link as LinkIcon,
  Check as CheckIcon,
  Share as ShareIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import { ShareModal } from './ShareModal.js';
export { ShareModal };

interface ShareButtonsProps {
  title: string;
  organization?: string;
  url?: string;
  showWhatsAppButton?: boolean;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  organization,
  url,
  showWhatsAppButton = true
}) => {
  const [copied, setCopied] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = organization
    ? `📢 ${title} - ${organization}. Check eligibility, dates, and apply:`
    : `📢 ${title}. Check eligibility, dates, and apply:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setToastOpen(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const dummy = document.createElement('input');
      dummy.value = shareUrl;
      document.body.appendChild(dummy);
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      setCopied(true);
      setToastOpen(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const socialChannels = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon sx={{ fontSize: 19 }} />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
      brandColor: '#25D366',
      bgColor: '#E8F9EE'
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon sx={{ fontSize: 19 }} />,
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      brandColor: '#0088cc',
      bgColor: '#E0F3FB'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon sx={{ fontSize: 19 }} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      brandColor: '#0A66C2',
      bgColor: '#E8F1FA'
    },
    {
      name: 'X (Twitter)',
      icon: <TwitterIcon sx={{ fontSize: 18 }} />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      brandColor: '#000000',
      bgColor: '#F3F4F6'
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon sx={{ fontSize: 19 }} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      brandColor: '#1877F2',
      bgColor: '#EBF2FC'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
        <Typography
          variant="caption"
          onClick={() => setModalOpen(true)}
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            color: '#0d3b66',
            fontSize: '13px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            '&:hover': { color: '#0f2a4a' }
          }}
        >
          <ShareIcon sx={{ fontSize: 15, color: '#0d3b66' }} />
          Share Opportunity
        </Typography>

        <Button
          size="small"
          onClick={() => setModalOpen(true)}
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            color: '#0d3b66',
            fontSize: '12px',
            fontWeight: 600,
            p: 0,
            minWidth: 'auto',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
          }}
        >
          More Channels →
        </Button>
      </Box>

      {/* Row of Social Channel Icons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap'
        }}
      >
        {socialChannels.map((channel) => (
          <Tooltip key={channel.name} title={`Share on ${channel.name}`} arrow placement="top">
            <IconButton
              component="a"
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: channel.bgColor,
                color: channel.brandColor,
                border: '1px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: channel.brandColor,
                  color: '#FFFFFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              {channel.icon}
            </IconButton>
          </Tooltip>
        ))}

        {/* Copy Link Button */}
        <Tooltip title={copied ? 'Link Copied!' : 'Copy Link to Clipboard'} arrow placement="top">
          <IconButton
            onClick={handleCopyLink}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: copied ? '#ECFDF5' : '#F3F4F6',
              color: copied ? '#059669' : '#374151',
              border: copied ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#E5E7EB',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {copied ? <CheckIcon sx={{ fontSize: 18, color: '#059669' }} /> : <LinkIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>

        {/* More Options Modal Trigger */}
        <Tooltip title="All Share Channels" arrow placement="top">
          <IconButton
            onClick={() => setModalOpen(true)}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#F3F4F6',
              color: '#374151',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                borderColor: '#2563EB',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Prominent Quick-Share on WhatsApp button */}
      {showWhatsAppButton && (
        <Button
          component="a"
          href={socialChannels[0].href}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          size="small"
          startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 1.5,
            borderRadius: 20,
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            bgcolor: '#E8F9EE',
            color: '#16A34A',
            border: '1px solid #BBF7D0',
            py: 0.75,
            '&:hover': {
              bgcolor: '#25D366',
              color: '#FFFFFF',
              borderColor: '#25D366'
            }
          }}
        >
          Share with WhatsApp Group
        </Button>
      )}

      {/* Copy notification toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: '100%', borderRadius: 2, border: '1px solid #A7F3D0', fontWeight: 600 }}
        >
          Opportunity link copied to clipboard!
        </Alert>
      </Snackbar>

      {/* YouTube-style Full Share Modal */}
      <ShareModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        organization={organization}
        url={shareUrl}
      />
    </Box>
  );
};

export interface JobCardShareProps {
  title: string;
  organization?: string;
  slug: string;
  variant?: 'icon' | 'button';
  size?: 'small' | 'medium';
}

export const JobCardShare: React.FC<JobCardShareProps> = ({
  title,
  organization,
  slug,
  variant = 'icon',
  size = 'small'
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {variant === 'icon' ? (
        <Tooltip title="Share to social media" arrow>
          <IconButton
            size={size}
            onClick={handleOpen}
            sx={{
              color: '#6B6B6B',
              p: 0.5,
              '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' }
            }}
          >
            <ShareIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          size="small"
          startIcon={<ShareIcon sx={{ fontSize: '13px !important' }} />}
          onClick={handleOpen}
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            color: '#0d3b66',
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            px: 1.25,
            py: 0.35,
            borderRadius: '4px',
            '&:hover': { color: '#0f2a4a', bgcolor: 'rgba(13, 59, 102, 0.06)' }
          }}
        >
          Share
        </Button>
      )}

      {/* YouTube-styled Share Modal */}
      <ShareModal
        open={modalOpen}
        onClose={handleClose}
        title={title}
        organization={organization}
        slug={slug}
      />
    </>
  );
};
