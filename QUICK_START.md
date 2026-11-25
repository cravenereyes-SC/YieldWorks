# Quick Start: Screenshot Auto-Fill Feature

## 🎯 What It Does

Takes a screenshot of your in-game work order and **automatically fills all the form fields** with the extracted data.

## 📋 Requirements

- Screenshot of your Star Citizen work order screen
- Clear, readable text in the screenshot
- One of the following browsers:
  - Chrome 90+
  - Edge 90+
  - Firefox 88+
  - Safari 14+

## ⚡ 3-Minute Setup

### 1️⃣ Launch the App
```
http://localhost:5500/salvage-session.html
```

### 2️⃣ Create a New Session
- Click **"Create New Session"**
- Select "Salvage" or "Mining"
- Click **"Create New Session"** again

### 3️⃣ Start a Work Order
- Click **"Start Work Order"** button
- The work order form opens

### 4️⃣ Take a Screenshot
In-game, take a screenshot that includes:
- ✓ Processing location name
- ✓ Refining/mining process type
- ✓ Duration timer
- ✓ Cost (aUEC)
- ✓ Current units to refine
- ✓ Expected yield

### 5️⃣ Upload Screenshot
1. Click **"📷 Upload Screenshot"** button
2. Select your screenshot file (PNG, JPG, etc.)
3. Wait for processing (2-5 seconds)
4. Watch the form auto-fill! ✨

### 6️⃣ Review & Submit
- Check all fields are correct
- Adjust any values if needed
- Click **"Start Work Order"**

## 🖼️ Screenshot Tips

### Best Practices
✅ **DO:**
- Capture the entire work order panel
- Use good lighting conditions
- Keep text crisp and clear
- Use at least 1920x1080 resolution

❌ **DON'T:**
- Crop important information
- Take blurry screenshots
- Use very dark HUD settings
- Zoom in too much

### Example Screenshot Content
```
Processing Location: ARC-L1 Wide Forest Station
Refining Process:    Ferron Exchange
Duration:            02:30:00
Cost:                2,500 aUEC
Current Units:       15 SCU
Expected Yield:      12 SCU
```

## 🎯 Extracted Fields

| Field | Source | Format | Example |
|-------|--------|--------|---------|
| **Location** | Station name | Full name | ARC-L1 Wide Forest Station |
| **Process** | Refining type | Full name | Ferron Exchange |
| **Duration** | Timer display | HH:MM | 2:30 (2 hours, 30 minutes) |
| **Cost** | aUEC value | Number | 2500 |
| **Current Units** | Input amount | Decimal (SCU) | 15.5 |
| **Final Yield** | Expected output | Decimal (SCU) | 12.0 |

## 🔧 Troubleshooting

### "Error processing screenshot"
**Problem**: OCR failed to read the image
**Solution**:
1. Check image quality - ensure text is readable
2. Try a different screenshot with better lighting
3. Make sure the full work order panel is visible
4. Increase screenshot resolution

### "Some fields didn't fill"
**Problem**: OCR missed certain text
**Solution**:
1. The field left blank can be filled manually
2. Try uploading a clearer screenshot next time
3. Ensure that text is not cut off at edges

### "Wrong location was extracted"
**Problem**: OCR misread similar-looking text
**Solution**:
1. The form shows what was extracted - you can fix it
2. Use the dropdown to select the correct location
3. Clearer screenshots help reduce misreads

### "Button says 'Processing...' but nothing happens"
**Problem**: Tesseract.js is loading (first time only)
**Solution**:
1. First use downloads OCR library (~5MB)
2. Wait 5-10 seconds on first attempt
3. Subsequent uploads are faster (2-5 seconds)
4. Close browser console if it's slow

## 🚀 Performance

| Task | Time |
|------|------|
| First screenshot load | ~5-10 seconds (download OCR library) |
| Subsequent screenshots | 2-5 seconds |
| Form population | <1 second |
| **Total (first run)** | ~6-12 seconds |
| **Total (after first)** | ~3-6 seconds |

## 💡 Pro Tips

### Tip 1: Multiple Work Orders
- You can upload multiple screenshots in one session
- Each upload auto-fills the form for that work order
- Perfect for batch processing orders

### Tip 2: Use Keyboard Shortcuts
- Press **Tab** to move between fields
- Press **Enter** to submit the form
- Adjust values quickly before submitting

### Tip 3: Session Tracking
- Each work order tracks its own timer
- Monitor multiple orders simultaneously
- Review completed orders in the "Completed" section

### Tip 4: Save Time
- OCR saves 30-60 seconds per work order
- Perfect for fast-paced trading/refining
- Reduces data entry errors

## 📊 Data Privacy

✅ **What happens to your screenshot:**
- Loaded into your browser
- Processed locally on your computer
- Never uploaded to any server
- Deleted from memory after extraction
- **Result**: Only the extracted data stays in the form

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

## 📚 Need More Help?

- **Full Guide**: See [SCREENSHOT_AUTOFILL_GUIDE.md](./SCREENSHOT_AUTOFILL_GUIDE.md)
- **Technical Details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Code Reference**: See [CODE_EXAMPLES.md](./CODE_EXAMPLES.md)

## ⚙️ Advanced: Offline Use

The feature works **offline** after first use:
1. First screenshot: Requires internet (loads OCR library)
2. Subsequent: Works completely offline
3. Perfect for laptops on the go!

## 🎓 How It Works (Simple Version)

```
Screenshot
    ↓
Your Browser reads it
    ↓
Tesseract.js (OCR) extracts text
    ↓
Smart parsing identifies each field
    ↓
Form auto-fills
    ↓
You review and submit
```

## 🐛 Report Issues

If you encounter bugs:
1. Note what went wrong
2. Take the screenshot that caused it
3. Check the browser console (F12 → Console tab)
4. Share details with the development team

## 📝 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Move to next field |
| **Shift+Tab** | Move to previous field |
| **Enter** | Submit work order |
| **Esc** | Close dialog (when open) |

## 💾 Data Storage

Work order data is saved:
- ✅ In your browser's local storage
- ✅ Visible in the "Sessions" tab
- ✅ Can be reviewed anytime
- ✅ Persists until you clear browser data

## 🎉 You're All Set!

Ready to streamline your work order entries? 
1. Take a screenshot of your work order
2. Click "📷 Upload Screenshot"
3. Watch the magic happen! ✨

Enjoy faster data entry and more time mining/salvaging!

---

**Version**: 1.0  
**Last Updated**: November 24, 2026  
**Status**: Production Ready ✅
