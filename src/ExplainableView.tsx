import { useState } from 'react';
import WhiteBoard from './WhiteBoard';
import renderCanvas from './canvas_components/render';
import { Input } from './components/ui/input';
import { DashboardViewType } from './storages/dashboardStorage';
import { StructureWithContext } from './structures/BBox';
import transform from './transforms/transform';


export type ViewSettings = {
  view_id: string;
}

export type ExplainableViewProps = {
  view: DashboardViewType;
  moveStructure: (struct_id: string, x: number, y: number) => void
}


function takePartOfData(component: BaseStructure, path: string) {
  const pathArr = path.split(".");
  let currentComponent: any = component;
  for (let i = 1; i < pathArr.length; i++) {
    currentComponent = currentComponent[pathArr[i]];
  }

  return currentComponent;
}


function ExplainableView(props: ExplainableViewProps) {
  const [path, setPath] = useState<string>(props.view.id);
  // useEffect(() => {
  //   api.onConnected(() => {
  //     clearHistory();
  //   });

  //   return () => {}
  // }, []);

  const structure = takePartOfData(props.view.swc.structure, path);

  const swc = {
    structure: transform(structure),
    position: {
      x: 50,
      y: 50,
    },
  } as StructureWithContext;

  const component = renderCanvas(swc, 0);

  return (
    <div>
      {/* <HistoryUI 
        paused={false}
        viewSettings={{view_id: ""}}
        onBackClick={() => {
          
        }}
        onPauseClick={() => {
          api.request("pause", true, (paused: any) => {
          });
        }}
        onForwardClick={() => {
          
        }} 
        onSettings={() => {}}
      /> */}
      <Input className="p-2 border border-b-0 rounded-none" defaultValue={path} onKeyDown={
        (e: any) => {
          if (e.key === "Enter") {
            setPath(e.target.value);
          }
        }
      }/>
      <div className="component-container">
        <WhiteBoard>
          {component}
        </WhiteBoard>
      </div>
    </div>
  )
}

export default ExplainableView
