import { Breadcrumbs as BreadcrumbsComponent, Text } from '@mantine/core';
import Link from 'next/link';
import { ChevronsRight } from 'tabler-icons-react';

import { Crumb } from '../../types/Crumbs';

const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  return (
    <BreadcrumbsComponent separator={<ChevronsRight size={20} />}>
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
