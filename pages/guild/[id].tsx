import axios from 'axios';
import { APIGuild, RouteBases, Routes } from 'discord-api-types/v10';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
const { oauth2_url } = require('../../config.json');
import { Dispatch, SetStateAction, useState } from 'react';
import {
    FaAngleRight,
    FaExclamation,
    FaTag,
    FaUser,
    FaTerminal,
    FaBars,
} from 'react-icons/fa';

async function getGuildData(
    id: string,
    accessToken: string
): Promise<APIGuild> {
    const axiosResponse = await axios.get(RouteBases.api + Routes.guild(id), {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
        validateStatus: (status) => true,
    });
    const guild: APIGuild = axiosResponse.data;
    return guild;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id = context.params?.id;
    if (typeof id !== 'string') return { props: { guilds: null } };

    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: oauth2_url,
                permanent: false,
            },
        };
    }

    const accessToken = session.accessToken as string;
    console.log('Using access token: ' + accessToken);
    const guild = await getGuildData(id, accessToken);

    console.log(guild);

    return {
        props: { guild },
    };
}

type SidebarItemProps = {
    text: string;
    icon: JSX.Element;
    index: number;
    selectedInxed: number;
    setSelectedIndex: (selectedIndex: number) => void;
};

const SidebarItem = ({
    index,
    selectedInxed,
    setSelectedIndex,
    text,
    icon,
}: SidebarItemProps) => {
    return (
        <div
            className={`
                flex 
                cursor-pointer 
                flex-row 
                items-center 
                justify-between 
                border-l-4 
                border-gray-500
                px-2 py-4 
                text-gray-400 
                duration-300
                hover:border-gray-100
                hover:bg-blue-500
                hover:text-gray-100
                ${
                    selectedInxed == index
                        ? 'border-gray-100 bg-blue-500 text-gray-100'
                        : ''
                }
            `}
            onClick={(e) => {
                setSelectedIndex(index);
            }}
        >
            <div className="flex flex-row items-center space-x-2">
                {icon}
                <p>{text}</p>
            </div>
            <FaAngleRight className="" />
        </div>
    );
};

type SidebarItem = {
    text: string;
    icon: JSX.Element;
};

type SidebarProps = {
    items: SidebarItem[];
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ items, isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const onExpandSidebarHandler = () => setIsSidebarOpen(!isSidebarOpen);

    const HamburgerMenu = (
        <div
            onClick={(e) => {
                onExpandSidebarHandler();
            }}
            className="fixed bottom-0 m-2 rounded-lg bg-blue-500 p-2 text-gray-200 shadow-lg md:hidden"
        >
            <FaBars />
        </div>
    );

    const Sidebar = (
        <div
            className={`md:flex ${
                isSidebarOpen ? 'flex' : 'hidden'
            } h-screen w-screen flex-col bg-gray-800 py-4 shadow-lg md:w-1/4 lg:w-1/6`}
        >
            {items.map((item, index) => (
                <SidebarItem
                    key={index}
                    index={index}
                    text={item.text}
                    icon={item.icon}
                    selectedInxed={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                />
            ))}
        </div>
    );

    return (
        <>
            {HamburgerMenu} {Sidebar}
        </>
    );
};

const Card = () => {
    return (
        <div className="space-y-1 rounded-md border-l-4 border-l-blue-500 bg-gray-900 p-4 text-gray-100 shadow-lg">
            <h1 className="text-xl">Server info</h1>
            <h1 className="text-md text-gray-300">
                <p>Server name - 10 members</p>
                <p>Created 2 months ago</p>
            </h1>
        </div>
    );
};

const GuildPage = (props: any) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    if (!props.guilds) return;
    console.log(props.guilds);
    return (
        <div className="flex h-screen w-screen flex-row">
            <Sidebar
                items={[
                    { text: 'Manage warns', icon: <FaExclamation /> },
                    { text: 'Manage tags', icon: <FaTag /> },
                    { text: 'Manage users', icon: <FaUser /> },
                    { text: 'Manage commnads', icon: <FaTerminal /> },
                ]}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div
                className={`mx-auto md:flex ${
                    isSidebarOpen ? 'hidden' : 'flex'
                } w-screen bg-gray-700 p-4`}
            >
                <div className="flex  flex-col space-y-8 p-8">
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-3xl text-gray-200">Dashboard</h1>
                        <h1 className="text-lg text-gray-300">
                            Here, you can see information on your server, at a
                            glance.
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 grid-rows-3 gap-4 lg:grid-cols-3">
                        <Card />
                        <Card />
                        <Card />
                        <Card />
                        <Card />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuildPage;
