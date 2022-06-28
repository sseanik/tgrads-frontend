import { Breadcrumbs as BreadcrumbsComponent, Text } from '@mantine/core';
import Link from 'next/link';

import { Crumb } from '../types/Crumbs';

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  return (
    <BreadcrumbsComponent>
      {crumbs.map((item: Crumb, index: number) => {
        return (
          <Text
            variant='link'
            component={Link}
            href={Array.isArray(item.href) ? '' : item.href ?? ''}
            key={index}
          >
            {item.title}
          </Text>
        );
      })}
    </BreadcrumbsComponent>
  );
};

export default Breadcrumbs;
