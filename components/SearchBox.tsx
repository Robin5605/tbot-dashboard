import { UserCircleIcon } from '@heroicons/react/solid';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { getIconURL } from '../utils';
import ToggleSwitch from './ToggleSwitch';
import { ExtendedGuild } from '../pages/guilds';
import { useRouter } from 'next/router';
const { bot_invite_url } = require('../config.json');

type ListItemProps = {
    guild: ExtendedGuild;
};

type SearchBoxProps = {
    guilds: ExtendedGuild[];
};

function getHref(guild: ExtendedGuild): string | null {
    if (guild.canConfigure && guild.canInvite) return bot_invite_url;
    if (!guild.canInvite && guild.canConfigure) return '/guild/' + guild.id;
    return null;
}

function getText(guild: ExtendedGuild): string {
    if (guild.canConfigure && guild.canInvite) return 'Invite';
    if (!guild.canInvite && guild.canConfigure) return 'Configure';
    return 'Invite';
}

const RenderButton = ({ guild }: ListItemProps) => {
    const href = getHref(guild);
    if (href) {
        return (
            <Link href={href} passHref>
                <div className="rounded-md bg-blue-600 py-1 px-4 text-white shadow-sm shadow-gray-800 duration-200 hover:bg-blue-500">
                    {guild.canInvite ? 'Invite' : 'Configure'}
                </div>
            </Link>
        );
    } else {
        return (
            <div className="cursor-not-allowed rounded-md bg-gray-400 py-1 px-4 text-white shadow-sm shadow-gray-800 duration-200">
                Invite
            </div>
        );
    }
};

const ListItem = ({ guild }: ListItemProps) => {
    return (
        <div className="flex w-full cursor-pointer flex-row items-center justify-between p-4 py-3 duration-200 hover:bg-indigo-500 hover:text-gray-200 hover:shadow-lg">
            <div className="flex flex-row items-center space-x-4">
                <Image
                    src={getIconURL(guild)}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <p>{guild.name}</p>
            </div>

            <RenderButton guild={guild} />
        </div>
    );
};

const NoResultsFound = () => {
    return (
        <div className="flex h-10 w-full flex-row items-center space-x-4 p-4 py-6 ">
            <p className="text-gray-500">No results found.</p>
        </div>
    );
};

const SearchBox = ({ guilds }: SearchBoxProps) => {
    const [value, setValue] = useState<string>('');
    const [showConfigurables, setShowConfigurables] = useState<boolean>(false);
    const [showInvitables, setShowInvitables] = useState<boolean>(false);

    console.log(guilds);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    const transformed: [string, ExtendedGuild][] = guilds.map((guild) => [
        guild.name.toLowerCase(),
        guild,
    ]);

    const display = transformed
        .filter(([lowerCase, _]) => lowerCase.startsWith(value.trim()))
        .map(([_, actual]) => actual)
        .filter((guild) => (showConfigurables ? guild.canConfigure : true))
        .filter((guild) => (showInvitables ? guild.canInvite : true))
        .map((guild) => <ListItem guild={guild} key={guild.id} />);

    return (
        <div className="h-full w-full overflow-y-scroll scroll-smooth bg-gray-200 shadow-lg ring-1 ring-black/10 ease-in-out md:h-3/4 md:w-3/4 md:rounded-lg lg:h-2/3 lg:w-2/4">
            <input
                className="w-full rounded-t-lg border-b border-black/10 bg-transparent p-4 outline-none duration-300 focus:border-b-blue-500"
                placeholder="Search for a guild..."
                onChange={onChangeHandler}
                value={value}
            />
            <div className="inline-flex w-full flex-col space-y-2 p-4 text-gray-700 md:flex-row md:space-y-0 md:space-x-8">
                <div className="flex flex-row space-x-2">
                    <ToggleSwitch
                        enabled={showInvitables}
                        setEnabled={setShowInvitables}
                    />
                    <p>Only show invitable guilds</p>
                </div>
                <div className="flex flex-row space-x-2">
                    <ToggleSwitch
                        enabled={showConfigurables}
                        setEnabled={setShowConfigurables}
                    />
                    <p>Only show configurable guilds</p>
                </div>
            </div>

            {display.length == 0 ? <NoResultsFound /> : display}
            <div className="flex h-5 w-full flex-row items-center p-4">
                <p className="text-gray-500">
                    {showConfigurables
                        ? 'Only mutual servers and ones where you have "manage server" permissions are shown. (You can configure the bot)'
                        : showInvitables
                        ? 'Only servers that you have "Manage server" permission and the bot is not in are shown (you can invite the bot)'
                        : ''}
                </p>
            </div>
        </div>
    );
};

export default SearchBox;
