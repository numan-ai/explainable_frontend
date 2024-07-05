import { BaseStructure } from "./types";

const getByPath = (structure: BaseStructure, path: string): BaseStructure => {
    const parts = path.split(".");
    let current: any = structure;
    for (let i = 1; i < parts.length; i++) {
        current = current.data[parts[i]];
    }
    return current;
}

export default getByPath;