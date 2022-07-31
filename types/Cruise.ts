import { MantineSize } from "@mantine/core";
import { Map2 } from "tabler-icons-react";

export interface UserDetails {
  codes: string[];
  cohort: string;
  firstName: string;
  lastName: string;
  plusOne: boolean;
  plusOneFirstName: string;
  plusOneLastName: string;
}

export type EventDetail = {
  title: string;
  blurb: {
    title: string;
    link: string | null;
  };
  footnote: {
    title: string;
    size: MantineSize;
    link: string | null;
  };
  colour: string;
  icon: typeof Map2;
  iconCheck: boolean;
};