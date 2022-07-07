import { gql } from '@apollo/client';

export const QUERY_ALL_EVENTS = gql`
  query AllEvents {
    events(filters: { TGAEvent: { eq: true } }, pagination: { limit: 100 }) {
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

export const QUERY_SPECIFIC_EVENT = gql`
  query SpecificEvent($slug: String!) {
    events(filters: { Slug: { eq: $slug } }) {
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
          LocationURL
          Footnote
          Cost
          RSVPURL
          TGAEvent
        }
      }
    }
  }
`;
