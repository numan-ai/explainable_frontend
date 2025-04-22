import { Check, ClipboardCopy } from 'lucide-react';
import { useState } from 'react';
import Highlight from 'react-highlight';
import { Button } from './ui/button';
import { UI_COLORS } from '@/lib/colors';

const exampleCode = `
import time

import explainable


def draw(cm: explainable.ContextManager):
    ctx = cm.get("my_var", default=0)

    return explainable.Graph([
        explainable.TextNode(f"My var: {ctx}"),
    ], edges=[])


explainable.init(draw)
explainable.add_context()

my_var = 1

while True:
    my_var += 1
    time.sleep(0.5)
`.slice(1);

export default function NoConnectionComponent() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-xl font-extrabold mb-3" style={{
        color: UI_COLORS.TEXT_COLOR,
      }}>How to start</h1>
      <div className="relative min-w-[450px]">
        <Button 
          variant="outline"
          className="absolute right-[8px] top-[8px] w-8 h-8 p-0 rounded-[4px]"
          onClick={() => {
            navigator.clipboard.writeText(exampleCode);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }}
        >
          {!copied ? (
            <ClipboardCopy className="h-4 w-4"/>
          ) : (
            <Check className="h-4 w-4"/>
          )}
        </Button>
        <Highlight className="python">
          { exampleCode }
        </Highlight>
      </div>
    </div>
  )
}
