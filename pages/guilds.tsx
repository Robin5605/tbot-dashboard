import type { GetServerSidePropsContext } from 'next';
import SearchBox from '../components/SearchBox';
import axios from 'axios';
import {
    RESTGetAPICurrentUserGuildsResult,
    RESTPostOAuth2AccessTokenResult,
    RouteBases,
    Routes,
} from 'discord-api-types/v10';
import { getSession, signIn } from 'next-auth/react';
const {
    client_id,
    client_secret,
    redirect_uri,
    oauth2_url,
} = require('../config.json');

type GuildsPageProps = {
    guilds: RESTGetAPICurrentUserGuildsResult | null;
};

async function getCurrentUserGuilds(
    access_token: string
): Promise<RESTGetAPICurrentUserGuildsResult> {
    const res = await axios.get(RouteBases.api + Routes.userGuilds(), {
        headers: { Authorization: 'Bearer ' + access_token },
    });

    return res.status == 200 ? res.data : null;
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession(context);
    if (!session) {
        console.log('No sessoin, redirecting...');
        return {
            redirect: {
                destination: oauth2_url,
                permanent: false,
            },
        };
    }

    const accessToken = session.accessToken as string;

    return {
        props: { guilds: await getCurrentUserGuilds(accessToken) },
    };
};

const GuildsPage = ({ guilds }: GuildsPageProps) => {
    if (!guilds) return null;

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
            <SearchBox guilds={guilds} />
        </div>
    );
};

export default GuildsPage;
