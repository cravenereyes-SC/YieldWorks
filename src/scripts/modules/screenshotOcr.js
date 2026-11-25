let Tesseract = null;
let worker = null;
let workerInitError = null;

async function initializeTesseract() {
  if (worker) return worker;
  if (workerInitError) throw workerInitError;
  
  if (!Tesseract) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    Tesseract = window.Tesseract;
  }

  try {
    // Try with no special corePath first - let it use default
    worker = await Tesseract.createWorker('eng', 1);
    return worker;
  } catch (e) {
    workerInitError = e;
    console.warn('Tesseract worker initialization failed:', e);
    throw e;
  }
}

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
  
  // First try exact matching
  for (const process of processes) {
    if (upperText.includes(process.toUpperCase())) {
      return process;
    }
  }
  
  // Try fuzzy matching for OCR misreads
  // For Solventation processes that might be misread (Binqa, Dinyx, etc.)
  if (upperText.includes('SOLV')) {
    // Could be any Solventation process - return Dinyx as default or try to identify which one
    if (upperText.includes('DINYX') || upperText.includes('BINQA') || upperText.includes('SINYX') || 
        upperText.includes('SOLV')) {
      return 'Dinyx Solventation';
    }
  }
  
  // Try matching partial process names
  if (upperText.includes('FERRON') || upperText.includes('EXCHANGE')) {
    return 'Ferron Exchange';
  }
  if (upperText.includes('GASKIN') || (upperText.includes('PROCESS') && upperText.includes('GA'))) {
    return 'Gaskin Process';
  }
  if (upperText.includes('KLEIN') || (upperText.includes('PROCESS') && upperText.includes('KL'))) {
    return 'Klein Process';
  }
  if (upperText.includes('CORMACK') || (upperText.includes('PROCESS') && upperText.includes('COR'))) {
    return 'Cormack Process';
  }
  if (upperText.includes('THORNE') || (upperText.includes('PROCESS') && upperText.includes('THO'))) {
    return 'Thorne Process';
  }
  
  return null;
}

function extractNumbers(text) {
  const numbers = text.match(/\d+(\.\d+)?/g) || [];
  return numbers.map(n => parseFloat(n));
}

function parseDuration(text) {
  // Try to match "Xd Yh" format (e.g., "5d 8h")
  const daysHoursMatch = text.match(/(\d{1,2})\s*d\s*(\d{1,2})\s*h/i);
  if (daysHoursMatch) {
    const days = parseInt(daysHoursMatch[1], 10);
    const hours = parseInt(daysHoursMatch[2], 10);
    return {
      days,
      hours,
      minutes: 0
    };
  }

  // Try to match "Xd Ym" format (e.g., "5d 30m")
  const daysMinutesMatch = text.match(/(\d{1,2})\s*d\s*(\d{1,2})\s*m/i);
  if (daysMinutesMatch) {
    const days = parseInt(daysMinutesMatch[1], 10);
    const minutes = parseInt(daysMinutesMatch[2], 10);
    return {
      days,
      hours: 0,
      minutes
    };
  }
  
  // Try to match "HH:MM" format (e.g., "05:30")
  const timeMatch = text.match(/(\d{1,2}):(\d{1,2})/);
  if (timeMatch) {
    return {
      days: 0,
      hours: parseInt(timeMatch[1], 10),
      minutes: parseInt(timeMatch[2], 10)
    };
  }
  
  // Try to match "Xh Ym" format (e.g., "5h 30m")
  const hoursMinutesMatch = text.match(/(\d{1,2})\s*h\s*(\d{1,2})\s*m/i);
  if (hoursMinutesMatch) {
    return {
      days: 0,
      hours: parseInt(hoursMinutesMatch[1], 10),
      minutes: parseInt(hoursMinutesMatch[2], 10)
    };
  }

  return null;
}

export async function extractWorkOrderFromScreenshot(imageFile) {
  const statusEl = document.getElementById('screenshot-status');
  
  try {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = 'Processing image...';
    }

    let worker;
    try {
      worker = await initializeTesseract();
    } catch (e) {
      console.warn('Tesseract unavailable, using manual extraction', e);
      worker = null;
    }

    let extractedText = '';
    
    if (worker) {
      try {
        const result = await worker.recognize(imageFile);
        extractedText = result.data.text;
        // Store for debugging
        window.__lastOcrText = extractedText;
        console.log('OCR Text:', extractedText);
      } catch (e) {
        console.warn('OCR recognition failed, proceeding with empty text', e);
        extractedText = '';
      }
    }

    if (statusEl) {
      statusEl.textContent = 'Analyzing data...';
    }

    const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l);
    
    // Debug: log all extracted lines
    console.log('Extracted lines:');
    lines.forEach((line, i) => console.log(`${i}: ${line}`));
    
    const workOrderData = {
      location: null,
      process: null,
      days: null,
      hours: null,
      minutes: null,
      cost: null,
      currentUnits: null,
      yieldAmount: null
    };

    // Extract location and process
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!workOrderData.location) {
        workOrderData.location = normalizeLocationName(line);
      }

      if (!workOrderData.process) {
        workOrderData.process = normalizeProcessName(line);
      }

      if (workOrderData.hours === null) {
        const duration = parseDuration(line);
        if (duration) {
          workOrderData.days = duration.days;
          workOrderData.hours = duration.hours;
          workOrderData.minutes = duration.minutes;
        }
      }
    }

    // Set default duration if not found
    if (workOrderData.hours === null) {
      workOrderData.days = 0;
      workOrderData.hours = 0;
      workOrderData.minutes = 45;
    }

    // Extract numbers with better context awareness
    // In Star Citizen work orders: material qty is typically around 1000-10000, yield is slightly less
    let allNumbers = [];
    for (let i = 0; i < lines.length; i++) {
      const lineNumbers = extractNumbers(lines[i]);
      allNumbers.push(...lineNumbers.map(n => ({ value: n, lineIndex: i, line: lines[i] })));
    }

    // Sort numbers by value
    allNumbers.sort((a, b) => a.value - b.value);

    // Extract cost (largest 5-6 digit number, often around 10000-999999)
    for (const item of allNumbers.reverse()) {
      if (item.value >= 100 && item.value <= 999999 && !workOrderData.cost) {
        if (item.line.toUpperCase().includes('COST') || 
            item.line.toUpperCase().includes('aUEC') ||
            item.line.toUpperCase().includes('PRICE') ||
            item.line.includes('.')) { // Cost often has decimal point
          workOrderData.cost = Math.round(item.value);
          break;
        }
      }
    }

    // If cost not found by keywords, use the largest 4-6 digit number
    if (!workOrderData.cost) {
      for (let i = allNumbers.length - 1; i >= 0; i--) {
        const item = allNumbers[i];
        if (item.value >= 1000 && item.value <= 999999) {
          workOrderData.cost = Math.round(item.value);
          break;
        }
      }
    }

    // Extract current units and yield (medium-sized numbers, typically 1000-10000)
    // Look for specific patterns: 
    // - Current units: Look for "MANIFEST", "TO REFINE", "INPUT", or "QTY" keywords
    // - Yield: Look for "YIELD" or "OUTPUT" keywords
    
    // First try keyword-based extraction
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const numbers = extractNumbers(line);
      const upperLine = line.toUpperCase();
      
      for (const num of numbers) {
        if (num > 100 && num < 20000) {
          if (!workOrderData.currentUnits && 
              (upperLine.includes('MANIFEST') || 
               upperLine.includes('TO REFINE') || 
               upperLine.includes('INPUT') || 
               upperLine.includes('QTY'))) {
            workOrderData.currentUnits = num;
          }
          if (!workOrderData.yieldAmount && 
              (upperLine.includes('YIELD') || 
               upperLine.includes('OUTPUT') || 
               upperLine.includes('FINAL'))) {
            workOrderData.yieldAmount = num;
          }
        }
      }
    }
    
    // If we still need to find values, use all extracted numbers to find patterns
    if (!workOrderData.currentUnits || !workOrderData.yieldAmount) {
      let allNumbers = [];
      for (let i = 0; i < lines.length; i++) {
        const lineNumbers = extractNumbers(lines[i]);
        allNumbers.push(...lineNumbers.map(n => ({ value: n, lineIndex: i, line: lines[i] })));
      }

      // Sort numbers by value
      allNumbers.sort((a, b) => a.value - b.value);
      
      // Find unique 4-digit numbers (excluding cost which is typically larger)
      let uniqueFourDigit = [];
      let seenValues = new Set();
      
      for (const item of allNumbers) {
        if (item.value >= 1000 && item.value <= 20000 && !seenValues.has(item.value)) {
          if (!workOrderData.cost || Math.abs(item.value - workOrderData.cost) > 100) {
            uniqueFourDigit.push(item);
            seenValues.add(item.value);
          }
        }
      }
      
      // Assign based on order and value differences
      if (uniqueFourDigit.length >= 2) {
        // If we have two values, the first should be current units, second should be yield
        // Unless they're very close in value, then one might be a duplicate
        const val1 = uniqueFourDigit[0].value;
        const val2 = uniqueFourDigit[1].value;
        
        if (!workOrderData.currentUnits) {
          workOrderData.currentUnits = val1;
        }
        if (!workOrderData.yieldAmount) {
          // Yield is typically less than input amount or close to it
          workOrderData.yieldAmount = val2;
        }
      } else if (uniqueFourDigit.length === 1 && !workOrderData.currentUnits) {
        workOrderData.currentUnits = uniqueFourDigit[0].value;
      }
    }

    if (statusEl) {
      statusEl.textContent = 'Data extracted successfully!';
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 2000);
    }

    return workOrderData;
  } catch (error) {
    console.error('Screenshot processing error:', error);
    if (statusEl) {
      statusEl.textContent = 'Error processing screenshot. Please try again.';
      statusEl.style.color = '#ff6b6b';
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 3000);
    }
    throw error;
  }
}

export function cleanupTesseract() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
