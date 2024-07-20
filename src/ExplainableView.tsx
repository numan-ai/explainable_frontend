import render from './components/canvas/render.tsx';
import { ViewType } from './storages/viewStorage';
import WhiteBoard from './WhiteBoard';


export type ViewSettings = {
  view_id: string;
}

export type ExplainableViewProps = {
  view: ViewType;
  // setScale: (scale: number) => void;
}


function ExplainableView(props: ExplainableViewProps) {
  const view = props.view;
  // const [path, setPath] = useState<string>(view.id);
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
    <div className='slow-appear h-full'>
      {/* <Input className="p-2 border border-b-0 rounded-none" defaultValue={path} onKeyDown={
        (e: any) => {
          if (e.key === "Enter") {
            setPath(e.target.value);
          }
        }
      } name='view-path'/> */}
      <WhiteBoard view_id={view.id}>
        {component}
      </WhiteBoard>
    </div>
  )
}

export default ExplainableView
