"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TrackingParams = {
  article_slug?: string;
  article_category?: string;
  cta_type?: string;
  cta_label?: string;
  destination_url?: string;
  position?: string;
};

type TrackedLinkProps = {
  href: string;
  eventName: string;
  params: TrackingParams;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: TrackingParams) => void;
    dataLayer?: unknown[];
  }
}

export default function TrackedLink({
  href,
  eventName,
  params,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = () => {
    const eventParams = {
      ...params,
      destination_url: params.destination_url ?? href,
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
      return;
    }

    window.dataLayer?.push(["event", eventName, eventParams]);
  };

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
