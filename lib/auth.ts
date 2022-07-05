import axios from 'axios';

const strapiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://tgrads.vercel.app'
    : 'http://localhost:3000';

export async function signIn({ email, password }) {
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: email,
    password,
  });
  return res.data;
}
