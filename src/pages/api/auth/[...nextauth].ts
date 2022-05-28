import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../../services/firebaseConfig';

export default NextAuth({
  providers: [
    Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scope: 'read:user'
    })
  ],
  callbacks: {
    async session(session, profile) {
      try {
        const lastDonate = await getDoc(doc(db, 'users', profile.sub as string))
          .then(snap => {
            if (!snap.exists()) {
              return null;
            }
            return snap.data().lastDonate;
          })

        return {
          ...session,
          id: profile.sub,
          lastDonate: lastDonate ?? false
        }
      } catch {
        return {
          ...session,
          id: null,
          lastDonate: false
        }
      }
    },

    async signIn(user, account, profile) {
      try {
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
})