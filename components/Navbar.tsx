import { Navbar as NavbarComponent } from '@mantine/core';

import navItem from '../lib/navItem';
import MobileMenuButton from './MobileMenuButton';
import NavbarFooter from './NavbarFooter';

interface NavbarProps {
  opened: boolean;
}

const Navbar = ({ opened }: NavbarProps) => {
  return (
    <NavbarComponent
      fixed
      sx={{
        transition: 'width 500ms ease, min-width 500ms ease',
        overflow: 'hidden',
        width: opened ? 250 : 0,
        '@media (min-width: 575px)': {
          width: 0,
        },
        justifyContent: 'space-between',
      }}
    >
      <NavbarComponent.Section mt={10}>
        {navItem.map((item) => {
          return <MobileMenuButton key={item.url} {...item} />;
        })}
      </NavbarComponent.Section>
      <NavbarComponent.Section>
        <NavbarFooter />
      </NavbarComponent.Section>
    </NavbarComponent>
  );
};

export default Navbar;
