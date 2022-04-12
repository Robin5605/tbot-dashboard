import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';

const getIconURL = (guild: RESTAPIPartialCurrentUserGuild) => {
    return guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
};

const range = (num: number) => [...new Array(num)].map((_, i) => i);

export { getIconURL, range };
