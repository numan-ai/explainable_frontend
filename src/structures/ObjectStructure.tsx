type ObjectStructure = {
    type: "object";
    subtype: string;
    data: { [key: string]: BaseStructure };
} & BaseStructure;