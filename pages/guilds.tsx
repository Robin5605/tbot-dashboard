import type { GetServerSidePropsContext } from 'next';
import SearchBox from '../components/SearchBox';
import axios from 'axios';
import {
    GuildDefaultMessageNotifications,
    RESTAPIPartialCurrentUserGuild,
    RESTGetAPICurrentUserGuildsResult,
    RESTPostOAuth2AccessTokenResult,
    RouteBases,
    Routes,
} from 'discord-api-types/v10';
import { getSession, signIn } from 'next-auth/react';
const { oauth2_url, bot_token } = require('../config.json');

type GuildsPageProps = {
    guilds: ExtendedGuild[] | null;
};

export type ExtendedGuild = RESTAPIPartialCurrentUserGuild & {
    canInvite: boolean;
    canConfigure: boolean;
};

async function getCurrentUserGuilds(
    access_token: string
): Promise<RESTGetAPICurrentUserGuildsResult> {
    const res = await axios.get(RouteBases.api + Routes.userGuilds(), {
        headers: { Authorization: 'Bearer ' + access_token },
    });

    return res.status == 200 ? res.data : null;
}

async function getBotGuilds(): Promise<RESTGetAPICurrentUserGuildsResult> {
    const botToken = bot_token;

    const res = await axios.get(RouteBases.api + Routes.userGuilds(), {
        headers: { Authorization: 'Bot ' + botToken },
    });

    return res.status == 200 ? res.data : null;
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    const accessToken = session.accessToken as string;
    const userGuilds = await getCurrentUserGuilds(accessToken);
    const botGuildIDs = (await getBotGuilds()).map((guild) => guild.id);

    const guilds: ExtendedGuild[] = userGuilds.map((guild) => ({
        ...guild,
        canInvite:
            !botGuildIDs.includes(guild.id) &&
            (parseInt(guild.permissions) & 32) == 32,
        canConfigure: (parseInt(guild.permissions) & 32) == 32,
    }));

    return {
        props: { guilds },
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
