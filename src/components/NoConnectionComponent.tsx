import { Check, ClipboardCopy } from 'lucide-react';
import { useState } from 'react';
import Highlight from 'react-highlight';
import { Button } from './ui/button';

const exampleCode = `
import time
import explainable

# start the server
explainable.init()

# create your data
lst = [1, 2, 3]

# start observing
lst = explainable.observe("view1", lst)

# change your data
while True:
  lst[0] += 0
  lst[1] += 1
  lst[2] += 2
  time.sleep(1)
`.slice(1);

export default function NoConnectionComponent() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-extrabold mb-3">How to start</h1>
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
