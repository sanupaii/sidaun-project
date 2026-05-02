const fs = require('fs');

const file = 'public/model/model.json';
const dataStr = fs.readFileSync(file, 'utf8');
const data = JSON.parse(dataStr);

try {
  let count = 0;
  const layers = data.modelTopology.model_config.config.layers;
  for (const layer of layers) {
    if (layer.inbound_nodes && Array.isArray(layer.inbound_nodes) && layer.inbound_nodes.length > 0) {
      const newInboundNodes = [];
      for (const group of layer.inbound_nodes) {
        // Keras 3 format usually has { args: [ ... ], kwargs: { ... } }
        if (!Array.isArray(group) && group.args) {
          const newGroup = [];
          
          let argsList = group.args;
          // In some Add/Concatenate layers, args might be a nested array
          if (Array.isArray(group.args) && group.args.length === 1 && Array.isArray(group.args[0])) {
             argsList = group.args[0];
          }

          for (const arg of argsList) {
            if (arg && arg.class_name === '__keras_tensor__' && arg.config && arg.config.keras_history) {
               const history = arg.config.keras_history; // [name, node_index, tensor_index]
               newGroup.push([history[0], history[1], history[2], group.kwargs || {}]);
            } else if (arg && arg.class_name === '__keras_tensor__' && arg.config) {
               console.warn("Found keras_tensor but no history:", arg.config);
            }
          }
          if (newGroup.length > 0) {
            newInboundNodes.push(newGroup);
            count++;
          } else {
             // Fallback if we couldn't parse
             newInboundNodes.push(group);
          }
        } else {
          newInboundNodes.push(group); // Leave it if it's already an array
        }
      }
      layer.inbound_nodes = newInboundNodes;
    }
  }
  
  if (count > 0) {
    fs.writeFileSync(file, JSON.stringify(data));
    console.log(`Successfully patched ${count} inbound_nodes!`);
  } else {
    console.log("No Keras 3 inbound_nodes found to patch.");
  }

} catch (err) {
  console.error("Error parsing/patching:", err);
}
