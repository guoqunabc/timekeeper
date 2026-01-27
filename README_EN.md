# 🕐 TimeKeeper - Meeting Timer

English | [简体中文](./README.md)

A professional meeting speech timer with comprehensive features and beautiful interface, suitable for various meeting scenarios. **Pure HTML/JS, zero dependencies, double-click to use!**

[![GitHub](https://img.shields.io/badge/GitHub-guoqunabc/timekeeper-blue.svg)](https://github.com/guoqunabc/timekeeper)
[![GitLab](https://img.shields.io/badge/GitLab-guoqun1/time_keeper-orange.svg)](https://git.n.xiaomi.com/guoqun1/time_keeper)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Main Features

### 1️⃣ **Basic Timer** - Simple & Easy
- Enter speaker name and duration
- Click "Start" or press spacebar
- Large screen display, perfect for projection
- Red flashing warning when overtime

### 2️⃣ **Agenda Mode** - Essential for Meetings
- Pre-configure multiple speakers' agenda
- Auto sequential execution, no manual switching
- Support drag-and-drop sorting and instant editing
- Auto advance to next speaker after completion

### 3️⃣ **Record Management** - Never Lose Data
- Auto save each speech record
- Display name, duration, overtime info
- Export as CSV (Excel) or JSON
- Local persistence, refresh-proof

### 4️⃣ **Smart Alerts** - Time Management
- Yellow warning flash in last 1 minute
- Red dynamic alert when overtime
- Prominent visual effects, easy to recognize

### 5️⃣ **Language Switch** - i18n Support 🆕
- One-click switch between Chinese and English
- Auto save language preference
- Covers all interface text

### 6️⃣ **Zero Dependencies** - Ready to Use
- No software installation required
- No server configuration needed
- Double-click HTML file to start
- All data stored locally

---

## 🚀 Quick Start (3 Steps)

### 📥 Method 1: Download & Use (Recommended for Beginners)

1. **Download Project**
   ```bash
   git clone https://github.com/guoqunabc/timekeeper.git
   # or
   git clone git@git.n.xiaomi.com:guoqun1/time_keeper.git
   ```

2. **Open File**
   - Double-click `index.html` file

3. **Start Using**
   - Fill in speaker name and time
   - Click "Start" button
   - That's it! 🎉

### 🌐 Method 2: Online Use

Visit online demo: [TimeKeeper Demo](https://guoqunabc.github.io/timekeeper/)
> Note: Online version data is only saved in browser local storage

---

## 📖 Detailed User Guide

### I. Basic Timer Mode (For Temporary Use)

The simplest way to use, suitable for ad-hoc meetings or single speaker:

**Steps:**
1. Fill in speaker name in top input box (optional)
2. Set minutes and seconds
3. Click "Start" button or press **Spacebar**
4. Click "Stop" button when finished
5. Confirm stop, record auto saved

**Tips:**
- ⌨️ **Spacebar**: Quick start/stop
- ⌨️ **ESC Key**: Reset timer (when not started)
- 🟡 **Last 1 Minute**: Numbers turn yellow and flash
- 🔴 **Overtime**: Numbers turn red with dynamic flash
- 📊 All records displayed at bottom area

---

### II. Agenda Mode (For Formal Meetings)

Suitable for formal meetings with multiple speakers, pre-configure agenda for auto execution:

#### **Configure Agenda**

1. Click **⚙️ Config Button** in top-right corner
2. Click **"+ Add Speaker"** in the popup panel
3. Fill in information for each speaker:
   - Name (required)
   - Minutes
   - Seconds
4. Drag **⋮⋮** icon to adjust order
5. Click **"Save & Apply"**

#### **Meeting Execution Flow**

```
Speaker1 Timing → Click Stop → Auto Load Speaker2 → Click Start → ... 
```

✅ No manual switching, auto advance to next
✅ Support real-time editing of current speaker's name and time on main interface
✅ Edits automatically synced and saved to agenda config

#### **Config Panel Features**

- ➕ **Add Speaker**: Click bottom "Add" button
- ✏️ **Edit Info**: Modify directly in input boxes
- 🔄 **Drag to Sort**: Hold and drag left icon
- 🗑️ **Delete Speaker**: Click × button on right
- 📥 **Import Agenda**: Support CSV or JSON files
- 📤 **Export Agenda**: Generate backup file
- 🧹 **Clear Agenda**: Delete all speakers

---

### III. Import/Export Agenda

#### **Export Agenda**

1. Open config panel (click ⚙️)
2. Click "Export" button at bottom
3. Select format:
   - **JSON**: Complete backup, can be re-imported
   - **CSV**: Can be opened and edited in Excel

#### **Import Agenda**

**Method 1: Click Import Button**
1. Open config panel
2. Click "Import" button
3. Select CSV or JSON file

**Method 2: Drag & Drop (Faster)**
1. Open config panel
2. Directly drag file to panel area
3. Auto recognize and import

#### **CSV Format Description**

CSV file format example (can be created in Excel):
```csv
Name,Minutes,Seconds
Alice,5,0
Bob,10,30
Charlie,3,0
```

**Note:** First row is header, data starts from second row

#### **JSON Format Description**

JSON file format example:
```json
{
  "speakers": [
    { "name": "Alice", "minutes": 5, "seconds": 0 },
    { "name": "Bob", "minutes": 10, "seconds": 30 },
    { "name": "Charlie", "minutes": 3, "seconds": 0 }
  ],
  "exportTime": "2026/1/27 20:00:00"
}
```

---

### IV. Record Management

#### **View Records**

All speech records automatically displayed at page bottom, including:
- 👤 Speaker name
- ⏱️ Total duration (MM:SS)
- ⏰ Overtime duration (if overtime)
- 📅 Record timestamp

#### **Manage Records**

- **Delete Single Record**: Hover mouse over record, click × button on right
- **Clear All Records**: Click "Clear" button at bottom
- **Export Records**: Click "Export" button at bottom, select format

#### **Auto Save & Restore**

- ✅ All records auto saved to browser local storage
- ✅ Data won't be lost after page refresh
- ✅ If page closed during timing, auto restore within 12 hours
- ✅ Records permanently saved unless manually cleared

---

### V. Language Switch 🆕

Click the **Language Switch Button** below config button in top-right corner:
- Chinese mode displays: "中"
- English mode displays: "EN"
- Click to switch
- Language preference auto saved

---

## 🎹 Keyboard Shortcuts

| Key | Function | Description |
|------|------|------|
| **Space** | Start/Stop timing | Most common operation |
| **ESC** | Reset timer | Only works when not started |
| **Enter** | Confirm | Use in confirmation dialogs |

---

## 📁 Project Structure

```
timekeeper/
├── 📄 index.html                  # Main file (double-click to open)
├── 📄 README.md                   # Chinese documentation
├── 📄 README_EN.md                # English documentation
├── ⚙️  会议议程配置.js              # Config file (optional)
├── 📁 src/
│   └── Timer.js                   # Core code
├── 📁 fonts/                      # Local font files
│   ├── Arial.ttf
│   └── DINPro-Regular.otf
├── 📁 tests/                      # Test files
│   ├── 兼容性测试.html
│   ├── 自动化测试.html
│   ├── 运行测试.sh
│   └── 测试说明.md
├── 📄 配置示例1.csv               # CSV import example
└── 📄 配置示例2.json              # JSON import example
```

---

## 💡 Usage Tips

### For Beginners
1. **First Time**: Try basic mode to familiarize with operations
2. **Ad-hoc Meeting**: Just enter time and click start
3. **Export Records**: Export CSV after meeting for archiving

### For Advanced Users
1. **Formal Meeting**: Pre-configure agenda using config panel
2. **Backup Agenda**: Export JSON file as backup
3. **Batch Config**: Edit CSV in Excel then import
4. **Large Screen**: Press F11 for fullscreen mode for best effect
5. **Custom Config**: Directly edit `会议议程配置.js` file

### For Meeting Hosts
1. Configure agenda 10 minutes before meeting
2. Project to large screen
3. Click "Start" when each speaker begins
4. Watch color changes to remind speakers of time
5. Export records after meeting ends

---

## ❓ FAQ

### Q1: How to switch from agenda mode back to basic mode?
**A:** Open config panel → Click "Clear" → Click "Save & Apply"

### Q2: What if timing was accidentally interrupted?
**A:** Reopen page within 12 hours, it will auto restore to interrupted state (including current time and speaker info)

### Q3: How to backup agenda configuration?
**A:** Config panel → Export → Select JSON format → Save file. You can import this file directly next time

### Q4: Which browsers are supported?
**A:** All modern browsers (Chrome, Edge, Firefox, Safari, etc.), Chrome recommended for best experience

### Q5: What if exported CSV file has garbled text?
**A:** File includes UTF-8 BOM marker, Excel should open it properly. If still problematic, use Notepad to save as ANSI encoding

### Q6: Where is data stored?
**A:** All data (records, agenda, settings) stored in browser's localStorage, only saved locally, not uploaded to any server

### Q7: Can I open multiple timers simultaneously?
**A:** Yes, each browser tab runs independently without affecting others

### Q8: How to clear all data?
**A:** Clear records (bottom "Clear" button) + Clear agenda (config panel "Clear" button)

---

## 🧪 Testing

### Automated Testing

```bash
cd tests
./运行测试.sh
```

### Manual Testing

- Open `tests/兼容性测试.html` - Check browser compatibility
- Open `tests/自动化测试.html` - Run functional tests

See [测试说明.md](tests/测试说明.md) for details

---

## 🆕 Changelog

### v2.1.0 (2026-01-27)
- ✨ Added Chinese/English interface switching
- 🌐 Support language preference persistence
- 🎨 Optimized button layout and interaction

### v2.0.0 (2026-01-27)
- ✨ Visual agenda config panel
- ✨ Support CSV/JSON import/export
- ✨ Drag-and-drop speaker sorting
- ✨ Auto state restoration (12 hours)
- ✨ Real-time editing of speaker info on main interface

### v1.0.0
- ⏰ Precise timing with smart alerts
- 📋 Speech record management
- 🎨 Professional dark interface
- 📱 Responsive design

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Contribution Guide
1. Fork this project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

[MIT License](LICENSE) - Free to use, modify and distribute

---

## 📧 Contact

- **GitHub Issues**: [Submit Issue](https://github.com/guoqunabc/timekeeper/issues)
- **GitLab Issues**: [Submit Issue](https://git.n.xiaomi.com/guoqun1/time_keeper/issues)

---

## 🌟 Star History

If this project helps you, please give it a Star ⭐️

**Enjoy using it!** 🎉
