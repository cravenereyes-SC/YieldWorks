# Code Examples & Integration Guide

## 1. How the Screenshot Upload Works

### HTML Structure
```html
<!-- Screenshot upload button in work order form -->
<div class="screenshot-upload-section">
  <p class="screenshot-help">Auto-fill from screenshot (in-game work order screen)</p>
  <input id="work-order-screenshot" name="screenshot" type="file" accept="image/*" style="display: none;" />
  <button id="upload-screenshot-btn" class="hud-settings-trigger" type="button" style="width: 100%; margin-bottom: 0.5rem;">
    📷 Upload Screenshot
  </button>
  <div id="screenshot-status" class="screenshot-status" style="font-size: 0.85rem; color: #56d6ff; text-align: center; display: none;"></div>
</div>

<!-- New field added next to yield -->
<div class="units-fields-row">
  <div class="units-field">
    <label for="work-order-current-units">Current Units (SCU)</label>
    <input id="work-order-current-units" name="currentUnits" type="number" min="0" step="any" placeholder="e.g. 10" />
  </div>
  <div class="units-field">
    <label for="work-order-yield">Final Yield Amount (SCU)</label>
    <input id="work-order-yield" name="yieldAmount" type="number" min="0" step="any" placeholder="e.g. 14" />
  </div>
</div>
```

## 2. JavaScript Event Handlers

### Upload Button Handler
```javascript
// When user clicks upload screenshot button
if (uploadScreenshotBtnEl && workOrderScreenshotInputEl) {
  uploadScreenshotBtnEl.addEventListener("click", () => {
    // Trigger hidden file input
    workOrderScreenshotInputEl.click();
  });

  // When user selects a file
  workOrderScreenshotInputEl.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      uploadScreenshotBtnEl.disabled = true;
      uploadScreenshotBtnEl.textContent = "📷 Processing...";

      // Call OCR extraction function
      const workOrderData = await extractWorkOrderFromScreenshot(file);

      // Auto-populate all form fields
      if (workOrderData.location && processingLocationSelectEl) {
        processingLocationSelectEl.value = workOrderData.location;
      }

      if (workOrderData.process && workOrderTypeSelectEl) {
        workOrderTypeSelectEl.value = workOrderData.process;
      }

      if (workOrderData.hours !== undefined && hoursPicker) {
        hoursPicker.setValue(workOrderData.hours, false);
      }

      if (workOrderData.minutes !== undefined && minutesPicker) {
        minutesPicker.setValue(workOrderData.minutes, false);
      }

      if (workOrderData.cost && workOrderCostEl) {
        workOrderCostEl.value = workOrderData.cost;
      }

      if (workOrderData.currentUnits && workOrderCurrentUnitsEl) {
        workOrderCurrentUnitsEl.value = workOrderData.currentUnits;
      }

      if (workOrderData.yieldAmount && workOrderYieldEl) {
        workOrderYieldEl.value = workOrderData.yieldAmount;
      }

      // Show success message
      uploadScreenshotBtnEl.textContent = "📷 Screenshot Loaded ✓";
      setTimeout(() => {
        uploadScreenshotBtnEl.textContent = "📷 Upload Screenshot";
        uploadScreenshotBtnEl.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Failed to process screenshot:", error);
      uploadScreenshotBtnEl.textContent = "📷 Error - Try Again";
      uploadScreenshotBtnEl.disabled = false;
      setTimeout(() => {
        uploadScreenshotBtnEl.textContent = "📷 Upload Screenshot";
      }, 3000);
    }

    // Clear file input for next use
    workOrderScreenshotInputEl.value = "";
  });
}
```

## 3. OCR Module Functions

### Initialize Tesseract
```javascript
// Called once on first screenshot upload
async function initializeTesseract() {
  if (worker) return worker;
  
  if (!Tesseract) {
    // Load Tesseract.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    Tesseract = window.Tesseract;
  }

  // Create OCR worker instance
  worker = await Tesseract.createWorker('eng', 1, {
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.2.0/tesseract-core.wasm.js'
  });
  
  return worker;
}
```

### Main Extraction Function
```javascript
export async function extractWorkOrderFromScreenshot(imageFile) {
  try {
    const worker = await initializeTesseract();
    
    // Show processing status
    const statusEl = document.getElementById('screenshot-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = 'Processing image...';
    }

    // Run OCR on the image
    const result = await worker.recognize(imageFile);
    const extractedText = result.data.text;

    if (statusEl) {
      statusEl.textContent = 'Analyzing data...';
    }

    // Parse the extracted text
    const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l);
    
    const workOrderData = {
      location: null,
      process: null,
      hours: 0,
      minutes: 45,
      cost: null,
      currentUnits: null,
      yieldAmount: null
    };

    // Extract data from each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Try to find location
      if (!workOrderData.location) {
        workOrderData.location = normalizeLocationName(line);
      }

      // Try to find process type
      if (!workOrderData.process) {
        workOrderData.process = normalizeProcessName(line);
      }

      // Try to find duration
      if (!workOrderData.hours || !workOrderData.minutes) {
        const duration = parseDuration(line);
        if (duration) {
          workOrderData.hours = duration.hours;
          workOrderData.minutes = duration.minutes;
        }
      }

      // Extract numbers and determine what they represent
      const numbers = extractNumbers(line);
      for (const num of numbers) {
        if (num >= 100 && num <= 999999 && !workOrderData.cost) {
          if (line.toUpperCase().includes('COST') || 
              line.toUpperCase().includes('aUEC') ||
              line.toUpperCase().includes('PRICE')) {
            workOrderData.cost = Math.round(num);
          }
        }

        if (num > 0 && num < 1000) {
          if (line.toUpperCase().includes('CURRENT') || 
              line.toUpperCase().includes('INPUT') ||
              line.toUpperCase().includes('MATERIAL')) {
            if (!workOrderData.currentUnits) {
              workOrderData.currentUnits = num;
            }
          } else if (line.toUpperCase().includes('YIELD') || 
                     line.toUpperCase().includes('OUTPUT') ||
                     line.toUpperCase().includes('FINAL')) {
            if (!workOrderData.yieldAmount) {
              workOrderData.yieldAmount = num;
            }
          }
        }
      }
    }

    // Show success
    if (statusEl) {
      statusEl.textContent = 'Data extracted successfully!';
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 2000);
    }

    return workOrderData;
  } catch (error) {
    console.error('OCR Error:', error);
    const statusEl = document.getElementById('screenshot-status');
    if (statusEl) {
      statusEl.textContent = 'Error processing screenshot. Please check your image.';
      statusEl.style.color = '#ff6b6b';
    }
    throw error;
  }
}
```

### Location Normalization
```javascript
function normalizeLocationName(text) {
  const locations = {
    'ARC-L1': 'ARC-L1 Wide Forest Station',
    'CRU-L1': 'CRU-L1 Ambitious Dream Station',
    'HUR-L1': 'HUR-L1 Green Glade Station',
    'HUR-L2': 'HUR-L2 Faithful Dream Station',
    'MIC-L1': 'MIC-L1 Shallow Frontier Station',
    'Ruin Station': 'Ruin Station (Pyro VI)',
    'Checkmate': 'Checkmate Station (Pyro I)',
    'Orbituary': 'Orbituary (Pyro II)',
    'PatchCity': 'PatchCity (Pyro III)',
    'Starlight': 'Starlight Service Station (Pyro IV)',
    'Megarig': 'Megarig (Pyro V)'
  };

  for (const [key, value] of Object.entries(locations)) {
    if (text.toUpperCase().includes(key.toUpperCase())) {
      return value;
    }
  }
  return null;
}
```

### Process Normalization
```javascript
function normalizeProcessName(text) {
  const processes = [
    'Ferron Exchange',
    'Dinyx Solventation',
    'Gaskin Process',
    'Klein Process',
    'Cormack Process',
    'Thorne Process'
  ];

  const upperText = text.toUpperCase();
  for (const process of processes) {
    if (upperText.includes(process.toUpperCase())) {
      return process;
    }
  }
  return null;
}
```

### Number Extraction
```javascript
function extractNumbers(text) {
  const numbers = text.match(/\d+(\.\d+)?/g) || [];
  return numbers.map(n => parseFloat(n));
}
```

### Duration Parsing
```javascript
function parseDuration(text) {
  // Match HH:MM format
  const timeMatch = text.match(/(\d{1,2}):(\d{1,2})/) || text.match(/(\d{1,2})\s*h\s*(\d{1,2})/i);
  if (timeMatch) {
    return {
      hours: parseInt(timeMatch[1], 10),
      minutes: parseInt(timeMatch[2], 10)
    };
  }
  return null;
}
```

## 4. CSS Styling

### Units Field Layout
```css
.units-fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Two equal columns */
  gap: 0.75rem;                     /* Space between columns */
  margin-bottom: 0.75rem;
}

.units-field {
  display: flex;
  flex-direction: column;            /* Stack label above input */
}

.units-field label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--text);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.units-field input {
  width: 100%;
  padding: 0.65rem 0.7rem;
  color: var(--text);
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font: inherit;
}

.units-field input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
```

### Screenshot Upload Section
```css
.screenshot-upload-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
}

.screenshot-help {
  font-size: 0.75rem;
  color: var(--muted);
  margin: 0 0 0.5rem;
  text-align: center;
}

.screenshot-status {
  font-size: 0.85rem;
  color: var(--accent);
  text-align: center;
  margin-top: 0.5rem;
  animation: pulse 1s ease-in-out infinite;  /* Pulse animation */
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

## 5. Data Flow Example

### Input Screenshot Contains:
```
Processing Location: ARC-L1 Wide Forest Station
Refining Process: Ferron Exchange
Duration: 2:30 (hours:minutes)
Cost: 2500 aUEC
Current Units: 15 SCU
Final Yield: 12 SCU
```

### Processing Steps:
1. OCR extracts text from image
2. Parser finds each field:
   - "ARC-L1" → matches to "ARC-L1 Wide Forest Station"
   - "Ferron" → matches to "Ferron Exchange"
   - "2:30" → parsed to hours=2, minutes=30
   - "2500" in context of "aUEC" → cost=2500
   - "15" in context of "Current" → currentUnits=15
   - "12" in context of "Yield" → yieldAmount=12

3. Result object:
```javascript
{
  location: "ARC-L1 Wide Forest Station",
  process: "Ferron Exchange",
  hours: 2,
  minutes: 30,
  cost: 2500,
  currentUnits: 15,
  yieldAmount: 12
}
```

4. Form fields populated:
- processingLocation.value = "ARC-L1 Wide Forest Station"
- workOrderType.value = "Ferron Exchange"
- hours = 2, minutes = 30
- cost = 2500
- currentUnits = 15
- yieldAmount = 12

## 6. Error Handling

### Try-Catch Pattern
```javascript
try {
  const workOrderData = await extractWorkOrderFromScreenshot(file);
  // Success: populate form
} catch (error) {
  console.error("Failed to process screenshot:", error);
  // Show error message to user
  statusEl.textContent = 'Error processing screenshot. Please check your image.';
  statusEl.style.color = '#ff6b6b';
  // Re-enable button after delay
  setTimeout(() => {
    uploadScreenshotBtnEl.textContent = "📷 Upload Screenshot";
  }, 3000);
}
```

## 7. Future Enhancement Ideas

### Add Support for Multiple Screenshots
```javascript
// Batch processing of multiple work orders
async function processMultipleScreenshots(files) {
  const results = [];
  for (const file of files) {
    const data = await extractWorkOrderFromScreenshot(file);
    results.push(data);
  }
  return results;
}
```

### Add Training Data for Better Recognition
```javascript
// Store frequently extracted patterns for improvement
const trainingData = {
  locations: {},
  processes: {},
  patterns: {}
};

function updateTrainingData(extracted, manual) {
  if (extracted.location !== manual.location) {
    trainingData.locations[extracted.location] = manual.location;
  }
  // ... similar for other fields
}
```

### Add Validation Before Form Population
```javascript
function validateExtractedData(data) {
  const validation = {
    location: data.location !== null,
    process: data.process !== null,
    duration: data.hours >= 0 && data.minutes >= 0 && data.hours <= 24 && data.minutes < 60,
    cost: data.cost !== null && data.cost > 0,
    currentUnits: data.currentUnits === null || data.currentUnits > 0,
    yieldAmount: data.yieldAmount === null || data.yieldAmount > 0
  };
  
  return Object.values(validation).every(v => v);
}
```

---

**Usage**: Reference this guide when maintaining or extending the OCR functionality
**Last Updated**: November 24, 2026
