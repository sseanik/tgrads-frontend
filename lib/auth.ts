import axios from 'axios';

export async function signIn({ email, password }) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
    {
      identifier: email,
      password,
    }
  );
  return res.data;
}
