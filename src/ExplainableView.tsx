import { useEffect, useState } from 'react';
import { clearHistory } from './structures/history';

import WhiteBoard from './WhiteBoard';
import api from './api';
import renderCanvas from './canvas_components/render';
import { DashboardViewType } from './storages/dashboardStorage';
import { StructureWithContext } from './structures/BBox';
import transform from './transforms/transform';


export type ViewSettings = {
  view_id: string;
}

export type ExplainableViewProps = {
  view: DashboardViewType;
}


function ExplainableView(props: ExplainableViewProps) {
  // useEffect(() => {
  //   api.onConnected(() => {
  //     clearHistory();
  //   });

  //   return () => {}
  // }, []);

  const swc = {
    structure: transform(props.view.structure),
    position: {
      x: 50,
      y: 50,
    },
  } as StructureWithContext;

  const component = renderCanvas(swc, 0);

  return (
    <div>
      {/* <HistoryUI 
        paused={paused}
        viewSettings={viewSettings}
        onBackClick={() => {
          const clb = () => {
            setStructure(currentStructure => {
              const newStructure = Object.assign({}, currentStructure);
              const diff = historyBack(newStructure);
              if (diff === undefined) {
                return newStructure;
              }
              return newStructure;
            });
          }
          if (!paused) {
            api.request("pause", !paused, (paused: any) => {
              setPaused(paused);
              clb();
            });
          } else {
            clb();
          }
        }}
        onPauseClick={() => {
          if (paused) {
            historyForwardMax(structure);
          }
          api.request("pause", !paused, (paused: any) => {
            setPaused(paused);
          });
        }}
        onForwardClick={() => {
          setStructure(currentStructure => {
            const newStructure = Object.assign({}, currentStructure);
            const diff = historyForward(newStructure);
            if (diff === undefined) {
              return newStructure;
            }
            return newStructure;
          });
        }} 
        onSettings={() => {}}
      /> */}
      <div className="component-container">
        <WhiteBoard>
          {component}
        </WhiteBoard>
      </div>
    </div>
  )
}

export default ExplainableView
