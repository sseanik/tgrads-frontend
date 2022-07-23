import { gql } from '@apollo/client';

export const QUERY_STATE_GALLERIES = gql`
  query StateGalleries($state: String!) {
    galleries(
      filters: { Event: { State: { eq: $state } } }
      pagination: { limit: 100 }
    ) {
      data {
        attributes {
          Recap
          FeaturedPhotos {
            data {
              attributes {
                url
              }
            }
          }
          Event {
            data {
              attributes {
                State
                Date
                Description
                Location
                Slug
                Title
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERY_GALLERY_SLUGS = gql`
  query AllGalleries {
    galleries(pagination: { limit: 100 }) {
      data {
        attributes {
          Event {
            data {
              attributes {
                Slug
                State
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERY_SPECIFIC_GALLERY = gql`
  query SpecificGallery($slug: String!) {
    galleries(filters: { Event: { Slug: { eq: $slug } } }) {
      data {
        id
        attributes {
          Photos(pagination: { limit: 100 }) {
            data {
              id
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
          Event {
            data {
              attributes {
                Title
              }
            }
          }
          Recap
        }
      }
    }
  }
`;
