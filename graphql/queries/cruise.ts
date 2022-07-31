import { gql } from '@apollo/client';

export const QUERY_CRUISE_EVENT = gql`
  query CruiseData {
    cruise {
      data {
        attributes {
          Title
          EventDetailsURL
          DateTime
          Blurb {
            Title
            BlurbTitle
            BlurbLink
            FootnoteTitle
            FootnoteSize
            FootnoteLink
            Colour
            IconCheck
          }
        }
      }
    }
  }
`;
