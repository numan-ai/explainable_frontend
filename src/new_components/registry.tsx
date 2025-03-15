import TextComponent from "./TextWidget";
import RowComponent from "./RowWidget";
import ColumnComponent from "./ColumnWidget";
import PixelComponent from "./PixelWidget";
import LineChartComponent from "./LineChartWidget";

const widgets: Record<string, any> = {
    [TextComponent.id]: TextComponent.Widget,
    [RowComponent.id]: RowComponent.Widget,
    [ColumnComponent.id]: ColumnComponent.Widget,
    [PixelComponent.id]: PixelComponent.Widget,
    [LineChartComponent.id]: LineChartComponent.Widget,
}

const sizes: Record<string, any> = {
    [TextComponent.id]: TextComponent.getSize,
    [RowComponent.id]: RowComponent.getSize,
    [ColumnComponent.id]: ColumnComponent.getSize,
    [PixelComponent.id]: PixelComponent.getSize,
    [LineChartComponent.id]: LineChartComponent.getSize,
}

export const getWidget = (name: string) => {
    const widget = widgets[name];
    if (widget === undefined) {
        console.error("Can't find widget", name);
        return undefined;
    }
    return widget;
}

export const getWidgetSize = (name: string, data: any) => {
    const size = sizes[name];
    if (size === undefined) {
        console.error("Can't find size", name);
        return undefined;
    }
    return size(data);
}