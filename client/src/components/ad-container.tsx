"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdComponentProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

const AdsenseAd: React.FC<AdComponentProps> = ({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
}) => {
  useEffect(() => {
    try {
      // Push the ad unit to the adsbygoogle array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error: ", err);
    }
  }, []); // Empty dependency array ensures this runs once after initial render

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "inline-block", width: "300px", height: "300px" }}
      data-ad-client="ca-pub-1874162807627805" // Your Publisher ID
      data-ad-slot={adSlot} // 4233118692
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    ></ins>
  );
};

export default AdsenseAd;
