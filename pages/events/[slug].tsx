import { Title } from '@mantine/core';
import axios from 'axios';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';

interface attributes {
  Title: string;
  Description: string;
  Footnote: string;
  Slug: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

const Events: NextPage<{event: attributes}> = ({ event }) => {
  console.log(event)
  return (
    <div>
      <Title order={1}>{event.Title}</Title>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  console.log(params.slug);
  const eventResponse = await axios.get(
    `https://telstra-grads.herokuapp.com/api/events/?slug=${params.slug}`
  );
  console.log(eventResponse.data)
  return {
    props: {
      event: eventResponse.data.data[0].attributes,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(
    'https://telstra-grads.herokuapp.com/api/events'
  );
  const paths = await data.data.map(
    (event: { id: number; attributes: any }) => {
      return { params: { slug: event.attributes.Slug.toString() } };
    }
  );
  return {
    paths,
    fallback: false,
  };
};

export default Events;
