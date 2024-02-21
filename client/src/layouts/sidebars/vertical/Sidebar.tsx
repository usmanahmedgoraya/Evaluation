import React from "react";
import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  isLogout?: boolean;
}

const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/analytics/dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Data Table",
    href: "/analytics/data-figures",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Logout",
    href: "/auth/login",
    icon: "bi bi-escape",
    isLogout: true,
  },
];

const Sidebar: React.FC<{ showMobilemenu: () => void }> = ({ showMobilemenu }) => {
  const router = useRouter();
  const location = router.pathname;

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    // Redirect to logout page
    router.push("/auth/login");
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center justify-between">
        <Logo />
        <Button
          close
          size="sm"
          className="sm:hidden"
          onClick={showMobilemenu}
        >
          <i className="bi bi-x-square lg:hidden"></i>
        </Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              {navi.isLogout ? (
                <Link
                  onClick={handleLogout}
                  className="nav-link text-secondary py-3"
                  // Use a dummy href to satisfy prop type validation
                  href="/auth/login"
                >
                  <i className={navi.icon}></i>
                  <span className="ms-3 d-inline-block">{navi.title}</span>
                </Link>
              ) : (
                <Link href={navi.href}
                  className={
                    location === navi.href
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className={navi.icon}></i>
                  <span className="ms-3 d-inline-block">{navi.title}</span>
                </Link>
              )}
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
