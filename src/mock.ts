import { ListCanvasRepresentation } from "./components/canvas/ListComponent";
import { StringCanvasRepresentation } from "./components/canvas/StringComponent";
import { ViewType } from "./storages/viewStorage";

export const IS_MOCKED = true;

export const MOCK_CONNECTED = true;
// const my_data = {
//   type: "dict",
//   data: {
//     "nodes": {
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
//     "edges": {
//       "type": "list",
//       "data": [
//         {
//           "type": "map",
//           "data": {
//             "start": {
//               "type": "string",
//               "value": "Mark Twain",
//             },
//             "end": {
//               "type": "string",
//               "value": "Franz Kafka",
//             },
//             "label": {
//               "type": "string",
//               "value": "Is not",
//             },
//           }
//         }
//       ]
//     }
//   }
// } as BaseStructure;


const my_data = {
  "type": "list",
  "data": [
    // {
    //   "type": "list",
    //   "data": [
    //     {
    //       "type": "string",
    //       "value": "Mark TwainIn",
    //     },
    //     {
    //       "type": "string",
    //       "value": "Franz KafkaIn",
    //     }
    //   ]
    // },
    {
      "type": "string",
      "value": "Mark TwainOut",
    },
    {
      "type": "string",
      "value": "Franz KafkaOut",
    }
  ]
}

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

const repr = {
  type: "list",
  source: {
    type: "reference", 
    path: "item",
  },
  item_representation: {
    type: "string",
  } as StringCanvasRepresentation,
} as ListCanvasRepresentation;

export const MOCK_VIEWS = [{
  id: "view1",
  structure: my_data,
  representation: repr,
  position: {
    x: 100,
    y: 100,
  },
}] as ViewType[];