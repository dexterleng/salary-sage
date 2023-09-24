
export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl leading-normal lg:leading-normal ${className}`}>
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`scroll-m-20 text-3xl font-semibold tracking-tight leading-normal lg:leading-normal ${className}`}>
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight leading-normal lg:leading-normal ${className}`}>
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`scroll-m-20 text-xl font-semibold tracking-tight leading-normal lg:leading-normal ${className}`}>
      {children}
    </h3>
  )
}

export function TypographyLarge({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg font-semibold leading-tight">
      {children}
    </p>
  )
}

export function TypographyBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-normal leading-snug">
      {children}
    </p>
  )
}

export function TypographySmall({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-medium leading-tight">
      {children}
    </small>
  )
}

export function TypographySubtle({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-normal text-muted leading-tight">
      {children}
    </small>
  )
}

export function TypographyExternalLink({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <a href={href} className="group text-primary text-sm font-semibold leading-tight" target="_blank" rel="noopener noreferrer">
      {children}
      <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 delay-150 group-hover:delay-0 h-0.5 bg-primary"></span>
    </a>
  )
}
