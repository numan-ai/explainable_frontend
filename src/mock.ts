import { ListCanvasRepresentation } from "./components/canvas/ListWidget";
import { StringCanvasRepresentation } from "./components/canvas/StringWidget";
import { ViewType } from "./storages/viewStorage";

export const IS_MOCKED = false;

export const MOCK_CONNECTED = true;
// const my_data = {
//   type: "graph",
//   keys: [
//     {
//       type: "string",
//       value: "nodes",
//     },
//     {
//       type: "string",
//       value: "edges",
//     }
//   ],
//   values: [
//     {
//       "type": "list",
//       "data": [
//         {
//           "type": "string",
//           "value": "Mark Twain",
//         },
//         {
//           "type": "string",
//           "value": "Franz Kafka",
//         }
//       ]
//     },
//     {
//       "type": "list",
//       "data": [
//         {
//           "type": "dict",
//           "keys": [
//             {
//               "type": "string",
//               "value": "start",
//             }, {
//               "type": "string",
//               "value": "end",
//             }, {
//               "type": "string",
//               "value": "label",
//             }
//           ],
//           "values": [
//             {
//               "type": "string",
//               "value": "Mark Twain",
//             }, {
//               "type": "string",
//               "value": "Franz Kafka",
//             }, {
//               "type": "string",
//               "value": "Is not",
//             }
//           ]
//         }
//       ]
//     },
//   ]
// };

const my_data = {
  "type": "list",
  "data": [
      {
          "type": "string",
          "value": "1"
      },
      {
          "type": "string",
          "value": "2"
      }
  ]
};


// const my_data = {
//   "type": "list",
//   "data": [
//     {
//       "type": "list",
//       "data": [
//         {
//           "type": "string",
//           "value": "Mark TwainIn",
//         },
//         {
//           "type": "string",
//           "value": "Franz KafkaIn",
//         }
//       ]
//     },
//     {
//       "type": "string",
//       "value": "Mark TwainOut",
//     },
//     {
//       "type": "string",
//       "value": "Franz KafkaOut",
//     }
//   ]
// }

// const my_data = {
//   "type": "dict",
//   "keys": [
//     {
//       "type": "string",
//       "value": "name",
//     },
//     {
//       "type": "string",
//       "value": "age",
//     }
//   ],
//   "values": [
//     {
//       "type": "list",
//       "data": [
//         {
//           "type": "string",
//           "value": "Mark TwainIn",
//         },
//         {
//           "type": "string",
//           "value": "Franz KafkaIn",
//         }
//       ]
//     },
//     {
//       "type": "string",
//       "value": "Franz Kafka",
//     }
//   ]
// };

// const repr = {
//   type: "list",
//   source: {
//     type: "reference",
//     path: "item",
//   } as StructureSource,
//   item_representation: [{
//     type: "list",
//     source: {
//       type: "reference",
//       path: "item",
//     } as StructureSource,
//     item_representation: {
//       type: "string",
//     } as Representation,
//   } as Representation, {
//     type: "string",
//   } as Representation, {
//     type: "string",
//   } as Representation],
// } as ListComponentRepresentation;

// const repr = {
//   type: "graph",
//   source: {
//     type: "reference", 
//     path: "item",
//   },
//   item_representation: {
//     type: "string",
//   } as StringCanvasRepresentation,
// } as ListCanvasRepresentation;

export const MOCK_VIEWS = [{
  id: "view1",
  structure: my_data,
  representation: null,
  position: {
    x: 100,
    y: 100,
  },
}] as ViewType[];