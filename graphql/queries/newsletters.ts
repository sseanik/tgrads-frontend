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
