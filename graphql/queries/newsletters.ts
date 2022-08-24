import { gql } from '@apollo/client';

export const QUERY_PUBLISHED_NEWSLETTERS = gql`
  query AllNewsletters {
    newsletters {
      data {
        attributes {
          publishedAt
          Title
          Slug
          FirstDayOfMonth
          Description
          Gif
          StateBlurbs {
            State
            Description
            Photos {
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
          EventBlurbs {
            Title
            Description
            Photos {
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
          CalendarTable {
            State
            Event
            Date
            Time
          }
        }
      }
    }
  }
`;

export const QUERY_NEWSLETTER_SLUGS = gql`
  query AllNewslettersSlugs {
    newsletters(publicationState: PREVIEW) {
      data {
        attributes {
          Slug
          FirstDayOfMonth
        }
      }
    }
  }
`;

export const QUERY_SPECIFIC_NEWSLETTER = gql`
  query SpecificNewsletter($slug: String!) {
    newsletters(filters: { Slug: { eq: $slug } }, publicationState: PREVIEW) {
      data {
        attributes {
          Title
          Slug
          FirstDayOfMonth
          Description
          Gif
          StateBlurbs {
            State
            Description
            Photos {
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
          EventBlurbs {
            Title
            Description
            Photos {
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
          CalendarTable {
            State
            Event
            Date
            Time
          }
        }
      }
    }
  }
`;
