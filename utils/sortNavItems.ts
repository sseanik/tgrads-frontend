import { NavMenu } from "../assets/navItem";

// If user is logged in, put their state at the front of the nav items
export const getSortedNavItems = (loggedIn: string, navItems: NavMenu) => {
  const sortedNavItems = loggedIn
    ? navItems.common.filter(
        (navItem) =>
          loggedIn !== '' && navItem.text !== JSON.parse(loggedIn).State
      )
    : navItems.common;
  if (loggedIn) {
    const stateMatchedNavItem = navItems.common.find(
      (navItem) =>
        loggedIn !== '' && navItem.text === JSON.parse(loggedIn).State
    );
    if (stateMatchedNavItem) sortedNavItems.unshift(stateMatchedNavItem);
  }
  return sortedNavItems;
};
