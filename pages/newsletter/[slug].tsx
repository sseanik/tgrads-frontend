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

import MjmlBirthdayBlurb from '../../components/Mjml/MjmlBirthdayBlurb';
import CustomTable from '../../components/Mjml/MjmlCalendarBlurb';
import MjmlCustomGap from '../../components/Mjml/MjmlCustomGap';
import MjmlEventBlurb from '../../components/Mjml/MjmlEventBlurb';
import MjmlHeaderBlurb from '../../components/Mjml/MjmlHeaderBlurb';
import MjmlStateBlurb from '../../components/Mjml/MjmlStateBlurb';
import { QUERY_SPECIFIC_NEWSLETTER } from '../../graphql/queries/newsletters';
import { QUERY_ALL_NAMES } from '../../graphql/queries/people';
import client from '../../lib/apollo';
import { getMonthName } from '../../utils/dateAndTimeUtil';

const NewsletterHTML: NextPage<{
  html: string;
}> = ({ html }) => {
  // On button click, send user a HTML file containing the MJML HTML string
  const downloadTxtFile = () => {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(
      new Blob([html], {
        type: 'text/html', // .html file
      })
    );
    element.download = 'email.html'; // name of file
    document.body.appendChild(element);
    element.click();
  };

  // Remove all font size zero CSS rules
  const newHTML: string = html.replaceAll('font-size:0;', '');

  return (
    <>
      <Center mt={10} style={{ background: 'white' }}>
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
      {/* Title and CSS styles in Mjml Head */}
      <MjmlHead>
        <MjmlTitle>{newsletters.data[0].attributes.Title}</MjmlTitle>
        <MjmlPreview>{newsletters.data[0].attributes.Title}</MjmlPreview>
        <MjmlAttributes>
          <MjmlAll font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></MjmlAll>
        </MjmlAttributes>
        <MjmlStyle>
          {`
          .border-shadow {
            border: 1px solid #eaecf0;
          }`}
        </MjmlStyle>
      </MjmlHead>
      {/* Body of the Mjml email with each blurb section */}
      <MjmlBody width={640} background-color='#fff'>
        <MjmlCustomGap />
        {/* Newsletter Header */}
        <MjmlHeaderBlurb
          title={newsletters.data[0].attributes.Title}
          description={newsletters.data[0].attributes.Description}
          gif={newsletters.data[0].attributes.Gif}
        />
        <MjmlCustomGap />
        {/* State Blurbs Section */}
        <MjmlStateBlurb blurbs={newsletters.data[0].attributes.StateBlurbs} />
        {/* Event Blurbs Section */}
        <MjmlEventBlurb blurbs={newsletters.data[0].attributes.EventBlurbs} />
        {/* Newsletter Birthday/Star Sign Section */}
        <MjmlBirthdayBlurb
          grads={grads.data}
          month={getMonthName(newsletters.data[0].attributes.FirstDayOfMonth)}
        />
        {/* Calendar Table Blurb Section */}
        {newsletters.data[0].attributes.CalendarTable.length > 0 && (
          <CustomTable table={newsletters.data[0].attributes.CalendarTable} />
        )}
      </MjmlBody>
    </Mjml>,
    {
      keepComments: false,
      validationLevel: 'strict', // do not compile unless passes all strict rules
    }
  );

  return {
    props: { newsletter: newsletters.data[0].attributes, html: html },
  };
};

export default NewsletterHTML;
