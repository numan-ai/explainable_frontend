import { BaseStructure } from "./types";

export interface HistoryItem {
    type: string;
    path: string;
}

export interface HistoryItemSetValue {
    type: "setValue";
    path: string;
    value: any;
    previoiusValue?: any;
}

let historyIndex = -1;
let history: HistoryItem[] = [];

export function pushHistory(stucture: BaseStructure, item: HistoryItem) {
    if (historyIndex !== history.length - 1) {
        return false;
    }
    history.push(item);
    if (history.length > 200) {
        history = history.slice(Math.max(history.length - 100, 0));
    }

    historyIndex = history.length - 2;
    historyForward(stucture);
    return true;
};

export function historyBack(stucture: BaseStructure) {
    if (historyIndex === -1) {
        return undefined;
    }
    historyIndex--;
    const item = history[historyIndex];
    if (item === undefined) {
        return undefined;
    }
    const parts = item.path.split(".");
    let current: any = stucture;
    for (let i = 1; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }

    switch (item.type) {
        case "setValue":
            const setValue = item as HistoryItemSetValue;
            if (current?.type === "dict" || current?.type === "graph") {
                const idx = current.keys.findIndex((key: any) => {
                    return key.type === "string" && key.value === parts[parts.length - 1];
                });
                if (idx === -1) {
                    console.error("Can't find:", parts[parts.length - 1], current, item.path);
                    return undefined;
                }
                current.values[idx] = setValue.previoiusValue;
            } else {
                current[parts[parts.length - 1]] = setValue.previoiusValue;
            }
            break;
    }

    return item;
};

export function historyForward(stucture: BaseStructure) {
    if (historyIndex === history.length - 1) {
        return undefined;
    }
    historyIndex++;
    const item = history[historyIndex];
    if (item === undefined) {
        return undefined;
    }
    const parts = item.path.split(".");

    let current: any = stucture;
    for (let i = 0; i < parts.length - 1; i++) {
        if (current?.type === "dict" || current?.type === "graph") {
            const idx = current.keys.findIndex((key: any) => {
                return key.type === "string" && key.value === parts[i];
            });
            if (idx === -1) {
                console.error("Can't find:", parts[i], current, item.path);
                return undefined;
            }
            current = current.values[idx];
            continue;
        }
        try {
            current = current[parts[i]];
        } catch (e) {
            console.error("Can't find:", parts[i], current, item.path);
            return undefined;
        }
    }

    switch (item.type) {
        case "setValue":
            const setValue = item as HistoryItemSetValue;
            if (current?.type === "dict" || current?.type === "graph") {
                const idx = current.keys.findIndex((key: any) => {
                    return key.type === "string" && key.value === parts[parts.length - 1];
                });
                if (idx === -1) {
                    console.error("Can't find:", parts[parts.length - 1], current, item.path);
                    return undefined;
                }
                current.values[idx] = setValue.value;
                current.values[idx].justUpdated = Date.now();
            } else {
                current[parts[parts.length - 1]] = setValue.value;
                current[parts[parts.length - 1]].justUpdated = Date.now();
            }
            break;
    }

    return item;
};


export function historyForwardMax(structure: BaseStructure) {
    while (historyForward(structure) !== undefined);
};

export function clearHistory() {
    history.length = 0;
    historyIndex = -1;
}