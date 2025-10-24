// CORRECTED Batch Completion Check Code
// Replace the existing code in the "Batch Completion Check" node with this

// Get the first successful upload item
const allItems = $input.all();

// Count items to determine batch info
const totalItems = allItems.length;
console.log('');
console.log(`🎉 BATCH COMPLETED! Processed ${totalItems} files successfully`);
console.log(`🔍 BATCH CHECK DEBUG: About to check if more batches needed`);

// Get the actual total from the script data (should be 33 items)
// This comes from the original script array in Load Script Lines node
const firstItem = allItems[0];
const totalScriptLines = firstItem.json.totalScriptLines || 33; // Use actual count from script
const maxItems = firstItem.json.originalConfig.maxItems || 5;
const totalBatches = Math.ceil(totalScriptLines / maxItems);

// Calculate current position based on the actual data from the items
// Use the globalIndex from the last processed item to know our position
const lastProcessedItem = allItems[allItems.length - 1];
const lastGlobalIndex = lastProcessedItem.json.globalIndex;
const processedSoFar = lastGlobalIndex; // This is the real count of items processed

// Determine current batch and next steps
const currentBatch = Math.ceil(processedSoFar / maxItems);
const nextStartIndex = processedSoFar; // Start next batch from where we left off
const hasMoreBatches = nextStartIndex < totalScriptLines;

console.log(`📊 Progress: ${processedSoFar}/${totalScriptLines} (Batch ${currentBatch}/${totalBatches})`);
console.log(`🔍 DEBUG: hasMoreBatches = ${hasMoreBatches}`);
console.log(`🔍 DEBUG: nextStartIndex = ${nextStartIndex}`);
console.log(`🔍 DEBUG: About to return loop control data to More Batches node`);

if (hasMoreBatches) {
  const remaining = totalScriptLines - processedSoFar;
  console.log(`📋 Remaining lines: ${remaining}`);
  console.log(`🔄 Continuing to next batch automatically...`);
} else {
  console.log('🎊 ALL SCRIPT LINES COMPLETED! The entire episode has been processed.');
  console.log('✅ Workflow complete!');
}

// Return loop control data with the original config from the items
const originalConfig = firstItem.json.originalConfig;

return [{ json: {
  hasMoreBatches: hasMoreBatches,
  nextStartIndex: nextStartIndex,
  currentBatch: currentBatch,
  totalBatches: totalBatches,
  totalScriptLines: totalScriptLines,
  processedSoFar: processedSoFar,
  originalConfig: originalConfig
}}];
