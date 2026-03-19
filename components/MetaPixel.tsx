"use client";

import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "PLACEHOLDER";

export default function MetaPixel() {
  if (!META_PIXEL_ID || META_PIXEL_ID === "PLACEHOLDER") return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper to fire pixel events with optional event ID for deduplication
export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as unknown as { fbq?: Function }).fbq) {
    const fbq = (window as unknown as { fbq: Function }).fbq;
    
    // Extract eventID if provided for deduplication
    if (params?.eventID) {
      const { eventID, ...eventParams } = params;
      fbq("track", event, eventParams, { eventID });
    } else {
      fbq("track", event, params);
    }
  }
}
