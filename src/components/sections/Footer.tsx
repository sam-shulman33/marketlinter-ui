import type { FooterSection as FooterSectionData } from "@/types/sanity";

interface FooterProps {
  data: FooterSectionData;
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 px-6 py-10 text-center">
      <div className="mx-auto max-w-[1140px]">
        {/* Copyright */}
        <p className="text-sm text-slate-500">{data.copyrightText}</p>

        {/* Links */}
        <div className="mt-4 flex justify-center gap-6">
          {data.links.map((link) => (
            <a
              key={link._key}
              href={link.url}
              className="footer-link-underline text-[13px] text-slate-500 transition-colors hover:text-green"
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
