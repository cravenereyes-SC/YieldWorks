# Work Order Screenshot Auto-Fill Feature

## Overview
The Star Citizen Mining & Salvage Tracker now supports **automatic form population from in-game work order screenshots** using OCR (Optical Character Recognition). Simply take a screenshot of your work order details in-game, and the app will extract all the data and fill in the form fields automatically.

## What's New

### 1. **New Form Field: Current Units (SCU)**
- **Location**: Next to "Final Yield Amount (SCU)" in the work order setup form
- **Purpose**: Track the amount of raw materials you're refining
- **Display**: Side-by-side layout for better UX
- **Units**: Changed from "cSCU" to "SCU" for both fields

### 2. **Screenshot Upload Button**
- **Button**: "📷 Upload Screenshot" in the work order setup form
- **Location**: Below the cost field, above the submit buttons
- **Action**: Click to select an image from your computer
- **Support**: Works with any image format (PNG, JPG, etc.)

### 3. **Auto-Filled Fields**
When you upload a screenshot of your in-game work order, the app automatically extracts and fills:
- ✅ **Processing Location** (e.g., "ARC-L1 Wide Forest Station")
- ✅ **Refining Process** (e.g., "Ferron Exchange")
- ✅ **Duration** (Hours and Minutes from the duration timer)
- ✅ **Cost** (aUEC amount)
- ✅ **Current Units** (SCU input amount)
- ✅ **Final Yield Amount** (SCU output amount)

### 4. **Display Updates**
Work orders now show both input and output units:
```
Input: 15 SCU | Yield: 12 SCU
```
(Previously only showed yield in cSCU format)

## How to Use

### Step 1: Open a Work Order Form
1. Click the **"Start Work Order"** button in the salvage session
2. The work order setup dialog will open

### Step 2: Take a Screenshot
1. In-game: Take a screenshot of your work order details
   - Make sure the screenshot includes: location, process type, duration, cost, current units, and expected yield
   - Use `Print Screen` or your game's screenshot key
2. Save the screenshot to your computer

### Step 3: Upload Screenshot
1. In the work order form, click the **"📷 Upload Screenshot"** button
2. Select your screenshot image file
3. The app will process the image and show:
   - **"Processing image..."** - OCR is reading the screenshot
   - **"Analyzing data..."** - Extracting work order details
   - **"Data extracted successfully!"** - Form fields are now filled

### Step 4: Review and Submit
1. All fields should be auto-populated
2. Review the extracted data for accuracy
3. Adjust any fields if needed
4. Click **"Start Work Order"** to submit

## Technical Details

### OCR Technology
- **Engine**: Tesseract.js 5.0.4 (JavaScript-based OCR)
- **Processing**: Runs entirely in your browser (no data sent to servers)
- **Language**: English
- **Performance**: ~2-5 seconds per screenshot

### Recognized Locations
- **Stanton System**: ARC-L1, CRU-L1, HUR-L1, HUR-L2, MIC-L1
- **Pyro System**: Ruin Station, Checkmate, Orbituary, PatchCity, Starlight Service Station, Megarig

### Recognized Processes
- Ferron Exchange
- Dinyx Solventation
- Gaskin Process
- Klein Process
- Cormack Process
- Thorne Process

### Image Quality Tips
For best OCR accuracy:
- ✅ **Good lighting** in your screenshot
- ✅ **Clear text** that's readable at regular zoom
- ✅ **Full work order panel** visible in the screenshot
- ✅ **Resolution**: 1920x1080 or higher recommended
- ⚠️ Avoid: Blurry screenshots, partial text, heavily darkened HUD

## Fallback: Manual Entry
If OCR extraction doesn't work perfectly:
1. The form will still be ready for manual input
2. Fields left empty can be filled manually
3. Adjust any misread values before submitting

## Privacy & Security
- **Local Processing**: All OCR processing happens on your computer
- **No Upload**: Screenshots are never sent to external servers
- **No Tracking**: The app doesn't collect or store your gameplay data
- **Offline Compatible**: Works even without an internet connection

## Troubleshooting

### "Error processing screenshot"
- Try a different screenshot with better lighting
- Ensure the work order details are clearly visible
- Try a higher resolution screenshot

### Some fields not filled
- The OCR might have missed certain text
- Check image quality and contrast
- Manually fill in any missing fields

### Wrong location/process extracted
- OCR sometimes misreads similar-looking text
- Double-check and correct before submitting
- Try a clearer screenshot if it happens frequently

## Files Modified

### HTML
- **salvage-session.html**: Added current units field, screenshot upload button, and status display

### JavaScript
- **salvage-session.js**: Added screenshot upload handler, field population logic
- **src/scripts/modules/screenshotOcr.js** (NEW): OCR extraction module

### CSS
- **src/styles/salvage-session.css**: Added styling for units-fields-row, screenshot section, and status animations

## Browser Compatibility
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- Requires WASM (WebAssembly) support

## Performance Impact
- Initial Tesseract.js load: ~5MB (lazy-loaded on first screenshot)
- Processing time: 2-5 seconds per image
- No impact on normal app performance

## Future Enhancements
Potential improvements:
- Multiple screenshot support in one session
- Batch processing of multiple screenshots
- Custom location/process recognition
- Handwriting recognition for handwritten notes
- Integration with Star Citizen API for real-time data

---

**Version**: 1.0  
**Last Updated**: November 24, 2026
