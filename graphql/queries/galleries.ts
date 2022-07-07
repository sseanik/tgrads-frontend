import { gql } from '@apollo/client';

export const QUERY_ALL_GALLERIES = gql`
  query Galleries {
    galleries {
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
    galleries {
      data {
        attributes {
          Event {
            data {
              attributes {
                Slug
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
