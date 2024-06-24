import { getBaseStyles } from "./BaseComponent";

interface ArrayComponentProps {
    structure: ArrayStructure;
    renderMap: StructureMappers;
    render: (struct: BaseStructure, renderMap: StructureMappers) => JSX.Element;
}

function ArrayComponent(props: ArrayComponentProps) {
    const items = props.structure.data.map(
        (item, idx) => (
            <div className="array-component-item" key={idx}>
                {props.render(item, props.renderMap)}
            </div>
        )
    );
    const style = getBaseStyles(props.structure);
    return (
        <div className="component array-component" style={style}>
            {items}
        </div>
    );
}

export default ArrayComponent;