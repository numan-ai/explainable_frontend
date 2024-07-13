import Highlight from 'react-highlight'

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
  return (
    <div>
      <h1 className="text-xl font-extrabold mb-2">How to start</h1>
      <Highlight className='python'>
        { exampleCode }
      </Highlight>
    </div>
  )
}
