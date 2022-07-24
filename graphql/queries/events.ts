import { gql } from '@apollo/client';

export const QUERY_STATE_EVENTS = gql`
  query StateEvents($state: String!) {
    events(
      filters: { TGAEvent: { eq: true }, State: { eq: $state } }
      pagination: { limit: 100 }
    ) {
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
    events(pagination: { limit: 100 }) {
      data {
        attributes {
          Slug
          State
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
