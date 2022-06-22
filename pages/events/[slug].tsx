import { Title } from '@mantine/core';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { fetchAPI } from '../../lib/api';
import Image from '../../components/Image';

interface attributes {
  Title: string;
  Description: string;
  Footnote: string;
  Slug: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  Preview: any;
  DateTime: any;
  Location: any;
}

const Events: NextPage<{ event: attributes }> = ({ event }) => {
  console.log(event);
  // const imageURL = getStrapiMedia(event.Preview.attributes);
  // console.log(imageURL)
  return (
    <div>
      <Title order={1}>{event.Title}</Title>
      <Image imageObj={event.Preview} alt='' />
      <Title order={2}>{event.Description}</Title>
      <Title order={3}>Date: {event.DateTime.Date}</Title>
      <Title order={3}>Time: {event.DateTime.Time}</Title>
      <Title order={3}>
        Location: {event.Location.Place}, {event.Location.Suburb}
      </Title>
      <Title order={3}>{event.Footnote}</Title>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const eventResponse = await fetchAPI('events', {
    filters: {
      slug: params.slug,
    },
    populate: ['Preview', 'DateTime', 'Location'],
  });

  return {
    props: { event: eventResponse.data[0].attributes },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await fetchAPI('events', { fields: ['slug'] });

  const paths = data.map((event: { id: number; attributes: any }) => {
    return { params: { slug: event.attributes.Slug } };
  });

  return {
    paths,
    fallback: false,
  };
};

export default Events;
