import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../assets/images/logos/xtremelogowhite.svg";
import user1 from "../../assets/images/users/user1.jpg";

interface HeaderProps {
  showMobmenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ showMobmenu }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar color="primary" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="hidden sm:visible">
          <Image src={LogoWhite} alt="logo" />
        </NavbarBrand>
        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="me-auto flex gap-x-4 text-white">
        <div>
          <Link href="/" passHref className="nav-link">
            Home
          </Link>
        </div>
        {/* <NavItem>
          <Link href="/about" className="nav-link" passHref>
            Blogs
          </Link>
        </NavItem> */}
        <div>
          <Link href="/analytics/dashboard" className="nav-link" passHref>Analytics</Link>
        </div>
        {/* <UncontrolledDropdown inNavbar nav>
          <DropdownToggle caret nav>
            DD Menu
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </div >
      {/* <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle color="primary">
          <div style={{ lineHeight: "0px" }}>
            <Image
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
              height="30"
            />
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Info</DropdownItem>
          <DropdownItem>My Account</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </Navbar>
  );
};

export default Header;
