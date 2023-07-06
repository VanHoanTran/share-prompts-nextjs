import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      // serverless -> lambda -> dynamodb
      try {
        await connectToDB();
        // check if user already logged in
        const userExist = await User.findOne({ email: profile.email });
        // if not, create a new user and save to database.
        if (!userExist) {
          console.log(profile);
          await User.create({
            email: profile.email,
            username: profile.name.replace(' ', '').toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log({ 'signIn error:': error });
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
