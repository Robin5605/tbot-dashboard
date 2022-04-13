import { UserCircleIcon } from '@heroicons/react/solid';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { getIconURL } from '../utils';

type ListItemProps = {
    guild: RESTAPIPartialCurrentUserGuild;
};

type SearchBoxProps = {
    guilds: RESTAPIPartialCurrentUserGuild[];
};

const ListItem = ({ guild }: ListItemProps) => {
    return (
        <Link href={'/guild/' + guild.id}>
            <div className="flex w-full cursor-pointer flex-row items-center space-x-4 p-4 py-3 duration-200 hover:bg-indigo-500 hover:text-gray-200 hover:shadow-lg">
                <Image
                    src={getIconURL(guild)}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <p>{guild.name}</p>
            </div>
        </Link>
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
    const [value, setValue] = useState('');

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    const transformed: [string, RESTAPIPartialCurrentUserGuild][] = guilds.map(
        (guild) => [guild.name.toLowerCase(), guild]
    );

    const display = transformed
        .filter(([lowerCase, _]) => lowerCase.startsWith(value.trim()))
        .map(([_, actual]) => actual)
        .map((guild) => <ListItem guild={guild} key={guild.id} />);

    return (
        <div className="h-full w-full overflow-y-scroll bg-gray-200 shadow-lg ring-1 ring-black/10 md:h-3/4 md:w-3/4 md:rounded-lg lg:h-2/3 lg:w-2/4">
            <input
                className="w-full rounded-t-lg border-b border-black/10 bg-transparent p-4 outline-none duration-300 focus:border-b-blue-500"
                placeholder="Search for a guild..."
                onChange={onChangeHandler}
                value={value}
            />

            {display.length == 0 ? <NoResultsFound /> : display}
        </div>
    );
};

export default SearchBox;
