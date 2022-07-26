import { gql } from '@apollo/client';

export const QUERY_ALL_NEWSLETTERS = gql`
  query AllNewsletters {
    newsletters {
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

export const QUERY_NEWSLETTER_SLUGS = gql`
  query AllNewslettersSlugs {
    newsletters {
      data {
        attributes {
          Slug
        }
      }
    }
  }
`;

export const QUERY_SPECIFIC_NEWSLETTER = gql`
  query SpecificNewsletter($slug: String!) {
    newsletters(filters: { Slug: { eq: $slug } }) {
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
