import { Button, Center } from '@mantine/core';
import {
  Mjml,
  MjmlAll,
  MjmlAttributes,
  MjmlBody,
  MjmlHead,
  MjmlPreview,
  MjmlSection,
  MjmlSpacer,
  MjmlStyle,
  MjmlTitle,
  MjmlWrapper,
  render,
} from 'mjml-react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import BirthdaySection from '../../components/Mjml/BirthdaySection';
import CustomHeading from '../../components/Mjml/CustomHeading';
import CustomTable from '../../components/Mjml/CustomTable';
import EventSection from '../../components/Mjml/EventSection';
import StateSection from '../../components/Mjml/StateSection';
import {
  QUERY_NEWSLETTER_SLUGS,
  QUERY_SPECIFIC_NEWSLETTER,
} from '../../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';

const NewsletterHTML: NextPage<{
  html: string;
}> = ({ html }) => {
  const downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([html], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'email.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Center mb={10}>
        <Button onClick={downloadTxtFile} variant='subtle'>
          Download HTML Email
        </Button>
      </Center>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    data: { newsletters },
  } = await client.query({
    query: QUERY_SPECIFIC_NEWSLETTER,
    variables: { slug: context?.params?.slug },
  });

  const {
    data: { grads },
  } = await client.query({
    query: QUERY_ALL_NAMES,
  });

  const { html } = render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>Last Minute Offer</MjmlTitle>
        <MjmlPreview>Last Minute Offer...</MjmlPreview>
        <MjmlAttributes>
          <MjmlAll font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></MjmlAll>
          <MjmlSection box-shadow='1px 4px 11px 0px rgba(0, 0, 0, 0.15)'></MjmlSection>
        </MjmlAttributes>
        <MjmlStyle>
          {`.border-shadow {
          -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
          -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
          box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
        }`}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody width={640} background-color='#F2F2F2'>
        <MjmlWrapper>
          <CustomHeading
            title={newsletters.data[0].attributes.Title}
            description={newsletters.data[0].attributes.Description}
            gif={newsletters.data[0].attributes.Gif}
          />
          <MjmlSpacer />
          <StateSection blurbs={newsletters.data[0].attributes.StateBlurbs} />
          <EventSection blurbs={newsletters.data[0].attributes.EventBlurbs} />
          <BirthdaySection
            grads={grads.data}
            month={new Date(
              newsletters.data[0].attributes.FirstDayOfMonth
            ).toLocaleString('default', { month: 'long' })}
          />
          <CustomTable table={newsletters.data[0].attributes.CalendarTable} />
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>,
    { validationLevel: 'soft' }
  );

  return {
    props: { newsletter: newsletters.data[0].attributes, html },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: {
      newsletters: { data },
    },
  } = await client.query({
    query: QUERY_NEWSLETTER_SLUGS,
  });

  const paths = data.map((newsletter) => {
    return {
      params: {
        slug: newsletter.attributes.Slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export default NewsletterHTML;
