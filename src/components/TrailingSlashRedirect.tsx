import { Navigate, useLocation } from "react-router-dom";

/** `/checkout/` → `/checkout` so React Router matches on reload. */
const TrailingSlashRedirect = () => {
  const { pathname, search, hash } = useLocation();

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return (
      <Navigate
        to={`${pathname.replace(/\/+$/, "")}${search}${hash}`}
        replace
      />
    );
  }

  return null;
};

export default TrailingSlashRedirect;
