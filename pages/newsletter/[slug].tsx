import { Button, Center } from '@mantine/core';
import {
  Mjml,
  MjmlAll,
  MjmlAttributes,
  MjmlBody,
  MjmlHead,
  MjmlPreview,
  MjmlStyle,
  MjmlTitle,
  render,
} from 'mjml-react';
import { GetServerSideProps, NextPage } from 'next';

import BirthdaySection from '../../components/Mjml/BirthdaySection';
import CustomGap from '../../components/Mjml/CustomGap';
import CustomHeading from '../../components/Mjml/CustomHeading';
import CustomTable from '../../components/Mjml/CustomTable';
import EventSection from '../../components/Mjml/EventSection';
import StateSection from '../../components/Mjml/StateSection';
import { QUERY_SPECIFIC_NEWSLETTER } from '../../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';

const NewsletterHTML: NextPage<{
  html: string;
}> = ({ html }) => {
  const downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([html], {
      type: 'text/html',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'email.html';
    document.body.appendChild(element);
    element.click();
  };

  const newHTML: string = html.replaceAll('font-size:0;', '');

  return (
    <>
      <Center mt={10}>
        <Button onClick={downloadTxtFile} variant='outline'>
          Download HTML Email
        </Button>
      </Center>
      <div dangerouslySetInnerHTML={{ __html: newHTML }} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
        <CustomGap />
        <CustomHeading
          title={newsletters.data[0].attributes.Title}
          description={newsletters.data[0].attributes.Description}
          gif={newsletters.data[0].attributes.Gif}
        />
        <CustomGap />
        <StateSection blurbs={newsletters.data[0].attributes.StateBlurbs} />
        <EventSection blurbs={newsletters.data[0].attributes.EventBlurbs} />
        <BirthdaySection
          grads={grads.data}
          month={new Date(
            newsletters.data[0].attributes.FirstDayOfMonth
          ).toLocaleString('default', { month: 'long' })}
        />
        {newsletters.data[0].attributes.CalendarTable.length > 0 && (
          <CustomTable table={newsletters.data[0].attributes.CalendarTable} />
        )}
      </MjmlBody>
    </Mjml>,
    {
      keepComments: false,
      validationLevel: 'strict',
    }
  );

  return {
    props: { newsletter: newsletters.data[0].attributes, html: html },
  };
};

export default NewsletterHTML;
