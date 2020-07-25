import { useState, useEffect } from "react";
import Link from "next/link";
import NProgress from "nprogress";
import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import Router from "next/router";
import ".././node_modules/nprogress/nprogress.css";
import Search from "./blog/Search";

//next js can provide us Router methods
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //handling sign out
  const handleSignout = () => {
    //remove the user from the local storage and redirect
    signout(() => Router.push(`/signin`));
  };

  return (
    <>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link href="/blogs">
                <NavLink>Blogs</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/contact">
                <NavLink>Contact</NavLink>
              </Link>
            </NavItem>
            {isAuth() && (
              <UncontrolledDropdown nav inNavbar className="pr-2">
                <DropdownToggle nav caret>
                  {isAuth().name}'s Dashboard
                </DropdownToggle>
                <DropdownMenu right>
                  {isAuth() && isAuth().role === 1 && (
                    <Link href="/admin">
                      <DropdownItem>Admin Dashboard</DropdownItem>
                    </Link>
                  )}
                  {
                    <Link href="/user">
                      <DropdownItem>User Dashboard</DropdownItem>
                    </Link>
                  }
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
            {isAuth() ? (
              <NavItem className="mr-4">
                <NavLink onClick={handleSignout}>Sign out </NavLink>
              </NavItem>
            ) : (
              <>
                <NavItem>
                  <Link href="/signin">
                    <NavLink>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem className="mr-4">
                  <Link href="/signup">
                    <NavLink>Signup </NavLink>
                  </Link>
                </NavItem>
              </>
            )}
            <NavItem>
              <Link href="/user/crud/blog ">
                <NavLink className="mr-4 pr-3 pl-3 text-light btn btn-primary">
                  CREATE YOUR BLOG
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </>
  );
};

export default Header;
