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
  // setScale: (scale: number) => void;
}


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

  const position = props.view.position || {
    x: 100,
    y: 100,
  };
  
  const component = render(view.structure, view.representation || null, position, view.id, 0);

  return (
    <div className='slow-appear'>
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
        <WhiteBoard view_id={view.id}>
          {component}
        </WhiteBoard>
      </div>
    </div>
  )
}

export default ExplainableView
