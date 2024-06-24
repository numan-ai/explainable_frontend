type MapStructure = {
    type: "map";
    data: { [key: string]: BaseStructure };
} & BaseStructure;
