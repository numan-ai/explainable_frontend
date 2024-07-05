import { useState } from 'react';
import WhiteBoard from './WhiteBoard';
import { Input } from './components/ui/input';
import { ViewType } from './storages/viewStorage';
import render from './components/canvas/render.tsx';


export type ViewSettings = {
  view_id: string;
}

export type ExplainableViewProps = {
  view: ViewType;
  // moveStructure: (struct_id: string, x: number, y: number) => void
}


// function takePartOfData(component: BaseStructure, path: string) {
//   const pathArr = path.split(".");
//   let currentComponent: any = component;
//   for (let i = 1; i < pathArr.length; i++) {
//     currentComponent = currentComponent[pathArr[i]];
//   }

//   return currentComponent;
// }


function ExplainableView(props: ExplainableViewProps) {
  const view = props.view;
  const [path, setPath] = useState<string>(view.id);
  // useEffect(() => {
  //   api.onConnected(() => {
  //     clearHistory();
  //   });

  //   return () => {}
  // }, []);

  // const structure = takePartOfData(props.view.structure, path);

  const component = render(view.structure, view.representation, view.position, view.id, 0);

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
      } name='view-path'/>
      <div className="component-container">
        <WhiteBoard>
          {component}
        </WhiteBoard>
      </div>
    </div>
  )
}

export default ExplainableView
