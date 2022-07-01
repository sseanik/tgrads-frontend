import { gql } from '@apollo/client';

export const QUERY_ALL_EVENTS = gql`
  query AllEvents {
    events(filters: { TGAEvent: { eq: true } }) {
      data {
        attributes {
          Slug
          Title
          Description
          Date
          Cost
          Image {
            data {
              attributes {
                name
                alternativeText
                caption
                width
                height
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERY_EVENT_SLUGS = gql`
  query AllEvents {
    events {
      data {
        attributes {
          Slug
        }
      }
    }
  }
`;

export const QUERY_SPECIFIC_EVENT = (slug: string | string[] | undefined) => {
  return gql`
  query SpecificEvent {
    events(filters: { Slug: { eq: "${slug}" } }) {
      data {
        attributes {
          Title
          Slug
          Image {
            data {
              attributes {
                name
                alternativeText
                caption
                width
                height
                url
              }
            }
          }
          Description
          Date
          Time
          Location
          Suburb
          GoogleMapsURL
          Footnote
          Cost
          RSVPURL
          TGAEvent
        }
      }
    }
  }
`;
};
