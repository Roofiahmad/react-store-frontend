import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SCROLL_TOP_BEHAVIOR } from "../constants";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(SCROLL_TOP_BEHAVIOR);
  }, [pathname]);

  return null;
}
