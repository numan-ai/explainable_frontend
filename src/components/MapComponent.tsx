import MapStructure from "../structures/MapStructure";
import BaseStructure from "../structures/BaseStructure";
import { getBaseStyles } from "./BaseComponent";

interface MapComponentProps {
    structure: MapStructure;
    renderMap: StructureMappers;
    render: (struct: BaseStructure, renderMap: StructureMappers) => JSX.Element;
}

function MapComponent(props: MapComponentProps) {
    const componentList = Object.keys(props.structure.data).map(
        (key, idx) => (
            <div className="map-component-item" key={idx}>
                <div className="map-component-item-key" key={idx}>
                    {key}
                </div>
                <div className="map-component-item-value">
                    {props.render(props.structure.data[key], props.renderMap)}
                </div>
            </div>
        )
    );
    const style = getBaseStyles(props.structure);
    return (
        <div className="component map-component" style={style}>
            {componentList}
        </div>
    );
}

export default MapComponent;