import Link, { LinkProps } from "next/link";

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<LinkProps, "href" | "as" | "onClick" | "onMouseEnter"> {
  href: LinkProps["href"];
  as?: LinkProps["as"];
}

const NextLinkComposed = ({
  children,
  as,
  href,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  ...props
}: NextLinkComposedProps) => {
  return (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      passHref
    >
      <a>{children}</a>
    </Link>
  );
};

export default NextLinkComposed;
