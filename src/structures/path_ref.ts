import { BaseStructure } from "./types";

const getByPath = (structure: BaseStructure, path: string): BaseStructure => {
    const parts = path.split(".");
    let current: any = structure;
    for (let i = 1; i < parts.length; i++) {
        if (current.type === "list") {
            current = current.data[parts[i]];
        } else if (current.type === "dict" || current.type === "graph") {
            const idx = current.keys.findIndex((key: any) => {
                return key.type === "string" && key.value === parts[i];
            });
            current = current.values[idx];
        } else {
            current = current[parts[i]];
        }
    }

    return current;
}

export default getByPath;