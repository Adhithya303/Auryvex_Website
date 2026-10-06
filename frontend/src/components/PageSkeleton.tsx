import "./PageSkeleton.css";

export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-label="Loading page" aria-busy="true">
      <div className="skeleton page-skeleton__bar page-skeleton__bar--title" />
      <div className="skeleton page-skeleton__bar page-skeleton__bar--sub" />
      <div className="skeleton page-skeleton__bar page-skeleton__bar--body" />
      <div className="skeleton page-skeleton__bar page-skeleton__bar--body" />
    </div>
  );
}
