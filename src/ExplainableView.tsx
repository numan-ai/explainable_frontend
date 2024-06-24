import { useEffect, useState } from 'react';
import { clearHistory, historyBack, historyForward, historyForwardMax, pushHistory } from './structures/history';
import HistoryUI from './ui/HistoryUI';

import api from './api';
import WhiteBoard from './WhiteBoard';
import transform from './transforms/transform';
import { StructureWithContext } from './structures/BBox';
import renderCanvas from './canvas_components/render';


export type ViewSettings = {
  view_id: string;
}


export type ExplainableViewProps = {
  view_id: string;
}


function ExplainableView(props: ExplainableViewProps) {
  const [structure, setStructure] = useState({
    type: "string",
    struct_id: "_",
    value: "Welcome to Numan\n123"
  } as StringStructure);

  const [viewSettings, setViewSettings] = useState({
    view_id: "view1",
  } as ViewSettings);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api.onConnected(() => {
      clearHistory();
    });

    api.onMessage("snapshot", (data) => {
      if (data.view_id !== props.view_id) {
        return;
      }
      setStructure(data.structure);
      setViewSettings(data.settings);
      setPaused(data.is_paused);
    });

    api.onMessage("diff", (diff) => {
      if (diff.view_id !== props.view_id) {
        return;
      }
      setStructure(currentData => {
        const newData = Object.assign({}, currentData);
        pushHistory(newData, diff);
        return newData;
      });
    });
    return () => {}
  }, []);

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
      <HistoryUI 
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
      />
      <div className="component-container">
        <WhiteBoard>
          {component}
        </WhiteBoard>
      </div>
    </div>
  )
}

export default ExplainableView
