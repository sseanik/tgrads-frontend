import { gql } from '@apollo/client';

export const QUERY_ALL_NAMES = gql`
  query AllNames {
    grads(pagination: { limit: 300 }) {
      data {
        attributes {
          FullName
          State
          StarSign
          TGA
        }
      }
    }
  }
`;
