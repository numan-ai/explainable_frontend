import render from './new_components/render.tsx';
import { ViewType } from './storages/viewStorage';
import WhiteBoard from './WhiteBoard';


function ExplainableView(props: {
  view: ViewType;
}) {
  const view = props.view;
  
  const component = render(view);

  return (
    <div className='slow-appear h-full'>
      <WhiteBoard view={view}>
        {component}
      </WhiteBoard>
    </div>
  )
}

export default ExplainableView
