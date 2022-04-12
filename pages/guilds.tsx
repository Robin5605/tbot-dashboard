import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
    NextPage,
} from 'next';
import { UserCircleIcon } from '@heroicons/react/solid';
import { ChangeEvent, useState } from 'react';
import SearchBox from '../components/SearchBox';
import axios from 'axios';
import {
    RESTAPIPartialCurrentUserGuild,
    RESTGetAPICurrentUserGuildsResult,
    RESTPostOAuth2AccessTokenResult,
    RouteBases,
    Routes,
} from 'discord-api-types/v10';
const { client_id, client_secret, redirect_uri } = require('../config.json');

type GuildsPageProps = {
    guilds: RESTGetAPICurrentUserGuildsResult | null;
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    if (!context.query) return { props: { guilds: null } };
    if (typeof context.query.code !== 'string')
        return { props: { guilds: null } };
    const { code } = context.query;

    const baseURL = RouteBases.api;
    const data = new URLSearchParams({
        client_id,
        client_secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
    });

    const tokenRes = await axios.post(
        baseURL + Routes.oauth2TokenExchange(),
        data,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    const token = (tokenRes.data as RESTPostOAuth2AccessTokenResult)
        .access_token;

    const guildsRes = await axios.get(baseURL + Routes.userGuilds(), {
        headers: { Authorization: 'Bearer ' + token },
    });

    const guilds: RESTGetAPICurrentUserGuildsResult = guildsRes.data;

    return {
        props: {
            guilds,
        },
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
