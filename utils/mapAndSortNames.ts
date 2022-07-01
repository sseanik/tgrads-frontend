import { Grad } from '../types/User';

export const mapAndSortNames = (gradNames: { data: Grad[] }) => {
  return gradNames.data.map(
    (grad: Grad) => `${grad.attributes.FirstName} ${grad.attributes.LastName}`
  );
};
