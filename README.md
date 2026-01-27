# 🕐 TimeKeeper - Meeting Timer

A professional meeting speaker timer with a clean, elegant interface. Perfect for conferences, meetings, and presentations.

**Pure HTML/JS, zero dependencies, ready to use!**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- ⚡ **Zero Dependencies** - No installation, no server needed
- 🎯 **Large Display** - High contrast numbers for projection/screen sharing
- ⏰ **Smart Alerts** - Yellow flash at last minute, red flash when overtime
- 📋 **Agenda Mode** - Pre-set speakers list, automatic sequencing
- 📊 **Record Management** - Auto-save all records, export to CSV/JSON
- 🎨 **Visual Configuration Panel** - Easy add/edit/import/export speakers
- 💾 **Data Persistence** - Local storage, keeps state after refresh/close
- 🔤 **Font Consistency** - Built-in local fonts for cross-device consistency

---

## 🚀 Quick Start (30 seconds)

1. **Open** - Click the `计时器.html` file
2. **Enter Info** - Fill speaker name and time
3. **Start** - Click "开始" or press Spacebar
4. **Stop** - Click "停止" and confirm

**That's it!**

---

## 📖 Full Guide

### Basic Mode (For temporary use)

```
1. Enter speaker name
2. Set time (minutes + seconds)
3. Click "开始" or press Spacebar
4. Click "停止" when finished
5. Record auto-saved, ready for next speaker
```

**Shortcuts:**
- ⌨️ **Space** = Start/Stop
- ⌨️ **ESC** = Reset (when not running)
- 🎨 **Last minute** = Yellow flashing
- 🔴 **Overtime** = Red flashing

---

### Agenda Mode (For formal meetings)

**Setup:**
1. Click ⚙️ button (top right) to open config panel
2. Add speakers (name + time)
3. Click "保存并应用" (Save and Apply)

**Auto Flow:**
```
Speaker 1 → End → Auto Switch → Speaker 2 → End → Auto Switch → ...
```

**Config Panel Features:**
- ✅ Add/remove/edit speakers
- ✅ Drag to reorder speaker sequence
- ✅ Import agenda (CSV/JSON files)
- ✅ Export agenda (backup files)
- ✅ Clear all agenda

---

## 🎯 Configuration

### Method 1: Visual Panel (Recommended for beginners)

1. Click ⚙️ button (top right)
2. Click "+ 添加演讲者" (+ Add Speaker)
3. Fill name and time
4. Drag to adjust order
5. Click "保存并应用" (Save and Apply)

**Tip:** Config panel supports drag & drop CSV/JSON files for import!

### Method 2: Edit Config File (Advanced users)

Edit `会议议程配置.js`:

```javascript
window.TIMEKEEPER_CONFIG = {
    speakers: [
        { name: "Zhang San", minutes: 5, seconds: 0 },
        { name: "Li Si", minutes: 10, seconds: 0 },
        { name: "Wang Wu", minutes: 3, seconds: 30 }
    ]
};
```

**Rules:**
- `speakers` array not empty → Auto enable Agenda Mode
- `speakers: []` → Back to Basic Mode
- Refresh page after changes

---

## 📊 Record Management

### View Records
All speaker records displayed at bottom, including:
- Speaker name
- Total duration
- Overtime duration (if any)
- Record timestamp

### Manage Records
- 🗑️ **Delete single** - Click × button on record
- 🧹 **Clear all** - Click "清空" (Clear) button
- 📥 **Export CSV** - Click "导出" (Export), generates Excel-compatible file

### State Recovery
- ✅ Refresh page → Keep current timer state
- ✅ Close and reopen (within 12h) → Auto recover
- ✅ Records persist → Until manually cleared

---

## 📁 Project Structure

```
Timer/
├── 📄 计时器.html           # ← Double-click this file to use
├── ⚙️  会议议程配置.js       # Configuration file
├── 📁 src/
│   └── Timer.js             # Core code (no need to modify)
├── 📁 fonts/                # Font files
│   ├── Arial.ttf
│   └── DINPro-Regular.otf
├── 📁 tests/                # Test files
│   ├── 兼容性测试.html
│   ├── 自动化测试.html
│   ├── 运行测试.sh
│   └── 测试说明.md
├── 📄 配置示例1.csv         # Agenda import example
├── 📄 配置示例2.json        # Agenda import example
├── 📄 说明文档.md           # Chinese documentation
└── 📄 README.md             # This file
```

---

## 🎹 Keyboard Shortcuts

| Key | Function |
|-----|----------|
| Space | Start/Stop timer |
| ESC | Reset timer (when not running) |
| Enter | Confirm stop (in dialog) |

---

## ❓ FAQ

### Q1: How to switch back to basic mode?
**A:** Clear all agenda (Config Panel → Clear → Save and Apply)

### Q2: Timer interrupted accidentally?
**A:** Reopen within 12 hours, auto recovery to interrupted state

### Q3: How to backup agenda configuration?
**A:** Config Panel → Export → Choose format (JSON or CSV) → Save file

### Q4: Supported browsers?
**A:** All modern browsers (Chrome, Edge, Firefox, Safari), recommend Chrome

### Q5: How to view exported CSV?
**A:** Open with Excel, WPS Spreadsheet, or any text editor

---

## 📝 Recent Updates

### Latest Features
- ✨ Visual agenda configuration panel
- ✨ CSV/JSON import/export support
- ✨ Drag to reorder speakers
- ✨ Auto state recovery (12 hours)

### Core Features
- ⏰ Accurate timing with smart alerts
- 📋 Speaker record management
- 🎨 Professional dark interface
- 📱 Responsive design

---

## 📄 License

[MIT](LICENSE)

---

## 💡 Usage Tips

1. **First time** - Start with basic mode to get familiar
2. **Formal meetings** - Prepare agenda in config panel beforehand
3. **Backup agenda** - Export JSON file as backup
4. **Large screen** - Use fullscreen mode (F11) for best projection
5. **Export records** - Export after meeting for statistics

**Enjoy using TimeKeeper!** 🎉

---

## 🌐 Access

Live demo: [https://your-username.github.io/timekeeper/](https://your-username.github.io/timekeeper/)

(Replace `your-username` with your actual GitHub username after deployment)
