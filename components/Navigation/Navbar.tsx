import { Navbar as NavbarComponent } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

import { NavMenu } from '../../lib/navItem';
import MobileMenuButton from './MobileMenuButton';
import NavbarFooter from './NavbarFooter';
// import NavbarFooter from './NavbarFooter';

interface NavbarProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
}

const Navbar = ({ opened, setOpened, navItems }: NavbarProps) => {
  return (
    <NavbarComponent
      fixed
      sx={{
        transition: 'width 500ms ease, min-width 500ms ease',
        overflow: 'hidden',
        width: opened ? 255 : 0,
        '@media (min-width: 735px)': {
          width: 0,
        },
        justifyContent: 'space-between',
      }}
    >
      <NavbarComponent.Section mt={10}>
        {navItems.common.map((item) => {
          return (
            <MobileMenuButton key={item.url} {...item} setOpened={setOpened} />
          );
        })}
      </NavbarComponent.Section>
      <NavbarComponent.Section>
        <NavbarFooter />
      </NavbarComponent.Section>
    </NavbarComponent>
  );
};

export default Navbar;
