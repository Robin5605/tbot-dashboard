import { Dispatch, SetStateAction, useState } from 'react';
import { Switch } from '@headlessui/react';

type ToggleSwitchProps = {
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
};

export default function ToggleSwitch({
    enabled,
    setEnabled,
}: ToggleSwitchProps) {
    return (
        <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-400'
            } relative inline-flex h-6 w-11 items-center rounded-full duration-300`}
        >
            <span className="sr-only">Enable notifications</span>
            <span
                className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white  duration-300`}
            />
        </Switch>
    );
}
