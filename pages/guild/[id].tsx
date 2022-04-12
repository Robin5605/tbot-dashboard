import { GetServerSidePropsContext } from 'next';

import { useState } from 'react';
import {
    FaAngleRight,
    FaExclamation,
    FaTag,
    FaUser,
    FaTerminal,
} from 'react-icons/fa';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    if (!context.params) return { props: { data: null } };
    if (typeof context.params.id !== 'string') return { props: { data: null } };

    return {
        props: { data: context.params.id },
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
};

const Sidebar = ({ items }: SidebarProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <div className=" flex h-screen w-1/5 flex-col bg-gray-800 py-4 shadow-lg">
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
};

const AnnouncementBox = () => {
    return (
        <div className="flex w-1/3 flex-col space-y-4 rounded-lg bg-gray-800 p-8 shadow-lg">
            <h1 className="text-2xl text-gray-200">Create an announcement</h1>
            <textarea className="h-full w-full resize-none rounded-lg bg-slate-700 p-2 text-white shadow-lg outline-none ring-1 ring-black/10 duration-200 focus:ring-2 focus:ring-blue-500"></textarea>
            <select className="rounded-lg bg-slate-700 text-gray-100 shadow-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option>Channel #1</option>
                <option>Channel #2</option>
                <option>Channel #3</option>
                <option>Channel #4</option>
            </select>
            <input
                type="button"
                value="Send"
                className="cursor-pointer rounded-lg py-2 text-gray-100 shadow-md ring-2 ring-blue-500/20 duration-200 hover:ring-blue-500"
            />
        </div>
    );
};

const GuildPage = (props: any) => {
    return (
        <div className="flex h-screen w-screen flex-row">
            <Sidebar
                items={[
                    { text: 'Manage warns', icon: <FaExclamation /> },
                    { text: 'Manage tags', icon: <FaTag /> },
                    { text: 'Manage users', icon: <FaUser /> },
                    { text: 'Manage commnads', icon: <FaTerminal /> },
                ]}
            />
            <div className="mx-auto flex w-full bg-gray-700 p-4">
                <div className="flex h-full w-full flex-col space-y-8 p-8">
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-3xl text-gray-200">Dashboard</h1>
                        <h1 className="text-lg text-gray-300">
                            Here, you can see information on your server, at a
                            glance.
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-3 gap-4">
                        <div className="space-y-1 rounded-md border-l-4 border-l-blue-500 bg-gray-900 p-4 text-gray-100 shadow-lg">
                            <h1 className="text-xl">Server info</h1>
                            <h1 className="text-md text-gray-300">
                                <p>Server name - 10 members</p>
                                <p>Created 2 months ago</p>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuildPage;
