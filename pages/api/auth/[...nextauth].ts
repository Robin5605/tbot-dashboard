import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
const {
    client_id,
    client_secret,
    oauth2_url,
} = require('../../../config.json');

export default NextAuth({
    providers: [
        DiscordProvider({
            clientId: client_id,
            clientSecret: client_secret,
            authorization: oauth2_url,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            console.log(
                '-----------------------------------------------------------'
            );
            console.log('ACCOUNT ----------------');
            console.log(account);
            console.log('TOKEN ------------------');
            console.log(token);
            if (account) token.accessToken = account.access_token;
            return token;
        },

        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
