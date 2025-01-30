import React from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

function SocialShare({ product }) {
  const shareUrl = window.location.href;
  const title = `Mira este producto: ${product.nombre}`;

  return (
    <div className="flex space-x-4 mt-6">
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      {/* Añade más botones según sea necesario */}
    </div>
  );
}

export default SocialShare;