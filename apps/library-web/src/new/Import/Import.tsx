import { getBrowserType } from "@unclutter/library-components/dist/common";
import { SettingsGroup } from "@unclutter/library-components/dist/components/Settings/SettingsGroup";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { BookmarksImportText } from "./Bookmarks";
import { CSVImportText, CSVImportButtons } from "./CSV";
import { InstapaperImportButtons, InstapaperImportText } from "./Instapaper";
import { RaindropImportText, RaindropImportButtons } from "./Raindrop";

export function ImportSection({}) {
    useEffect(() => {
        if (getBrowserType() === "firefox") {
            importOptions["bookmarks"].iconFile = "firefox.svg";
            importOptions["bookmarks"].backgroundColor = "bg-orange-100 dark:bg-orange-900";
        }
    }, []);

    const [activeOption, setActiveOption] = useState<keyof typeof importOptions>();

    return (
        <>
            <SettingsGroup
                title="Import articles"
                icon={
                    <svg className="h-4 w-4" viewBox="0 0 512 512">
                        <path
                            fill="currentColor"
                            d="M481.2 33.81c-8.938-3.656-19.31-1.656-26.16 5.219l-50.51 50.51C364.3 53.81 312.1 32 256 32C157 32 68.53 98.31 40.91 193.3C37.19 206 44.5 219.3 57.22 223c12.81 3.781 26.06-3.625 29.75-16.31C108.7 132.1 178.2 80 256 80c43.12 0 83.35 16.42 114.7 43.4l-59.63 59.63c-6.875 6.875-8.906 17.19-5.219 26.16c3.719 8.969 12.47 14.81 22.19 14.81h143.9C485.2 223.1 496 213.3 496 200v-144C496 46.28 490.2 37.53 481.2 33.81zM454.7 288.1c-12.78-3.75-26.06 3.594-29.75 16.31C403.3 379.9 333.8 432 255.1 432c-43.12 0-83.38-16.42-114.7-43.41l59.62-59.62c6.875-6.875 8.891-17.03 5.203-26C202.4 294 193.7 288 183.1 288H40.05c-13.25 0-24.11 10.74-24.11 23.99v144c0 9.719 5.844 18.47 14.81 22.19C33.72 479.4 36.84 480 39.94 480c6.25 0 12.38-2.438 16.97-7.031l50.51-50.52C147.6 458.2 199.9 480 255.1 480c99 0 187.4-66.31 215.1-161.3C474.8 305.1 467.4 292.7 454.7 288.1z"
                        />
                    </svg>
                }
                buttons={
                    <>
                        {Object.entries(importOptions).map(([id, option]) => (
                            <ImportButton
                                key={id}
                                {...option}
                                onClick={() => setActiveOption(id)}
                            />
                        ))}
                    </>
                }
            >
                <p>
                    The more articles in your library, the more related highlights you'll see inside
                    Unclutter. So also import the articles you saved inside other apps!
                </p>
            </SettingsGroup>

            {activeOption && (
                <SettingsGroup
                    title={importOptions[activeOption].name}
                    icon={
                        <img
                            className="h-4 w-4"
                            src={`/logos/${importOptions[activeOption].iconFile}`}
                        />
                    }
                    className={importOptions[activeOption].backgroundColor}
                    buttons={
                        <>
                            {activeOption === "csv" && <CSVImportButtons />}
                            {activeOption === "instapaper" && <InstapaperImportButtons />}
                            {activeOption === "raindrop" && <RaindropImportButtons />}
                        </>
                    }
                >
                    {/* {activeOption === "pocket" && <PocketImportSettings />} */}
                    {activeOption === "bookmarks" && <BookmarksImportText />}

                    {activeOption === "csv" && <CSVImportText />}
                    {activeOption === "instapaper" && <InstapaperImportText />}
                    {activeOption === "raindrop" && <RaindropImportText />}
                </SettingsGroup>
            )}
        </>
    );
}

function ImportButton({ iconFile, name, backgroundColor, onClick }) {
    return (
        <button
            className={clsx(
                "relative flex cursor-pointer select-none items-center rounded-md py-1 px-2 font-medium transition-transform hover:scale-[97%]",
                true && "dark:text-stone-800",
                backgroundColor
            )}
            onClick={onClick}
        >
            <img className="mr-2 inline-block h-4 w-4" src={`/logos/${iconFile}`} />
            {name}
        </button>
    );
}

export type ArticleImportSchema = {
    urls: string[];
    time_added?: number[];
    status?: number[];
    favorite?: number[];
};

type ImportOption = {
    name: string;
    iconFile: string;
    backgroundColor: string;
};
const importOptions: { [id: string]: ImportOption } = {
    pocket: {
        name: "Import Pocket",
        iconFile: "pocket.png",
        backgroundColor: "bg-red-100 dark:bg-red-900",
    },
    instapaper: {
        name: "Import Instapaper",
        iconFile: "instapaper.png",
        backgroundColor: "bg-gray-100 dark:bg-gray-800",
    },
    bookmarks: {
        name: "Import Bookmarks",
        iconFile: "chrome.svg",
        backgroundColor: "bg-gray-200 dark:bg-gray-700",
    },
    raindrop: {
        name: "Import Raindrop",
        iconFile: "raindrop.svg",
        backgroundColor: "bg-blue-100 dark:bg-blue-900",
    },
    csv: {
        name: "Import CSV",
        iconFile: "csv.svg",
        backgroundColor: "bg-green-100 dark:bg-green-900",
    },
};