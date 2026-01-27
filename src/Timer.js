// ========== TimeKeeper 主程序 ==========
// 配置已移至 config.js 文件，保持代码结构清晰

class Timer {
  constructor() {
    this.timeLeft = 0;
    this.initialTime = 0;
    this.isRunning = false;
    this.isOvertime = false;
    this.startTime = null;
    this.records = this.loadRecords(); // 从localStorage加载记录
    this.intervalId = null;
    this.pauseTime = null;
    this.overtimeStart = null;

    // 议程相关
    this.agendaSpeakers = [];
    this.currentSpeakerIndex = 0;
    this.isAgendaMode = false;
    this.isStateRestored = false;

    this.timerElement = document.getElementById("timer");
    this.startBtn = document.getElementById("startBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.minutesInput = document.getElementById("minutes");
    this.secondsInput = document.getElementById("seconds");
    this.recordList = document.getElementById("recordList");
    this.speakerNameInput = document.getElementById("speakerName");

    this.confirmDialog = document.querySelector(".confirm-dialog");
    this.confirmOverlay = document.querySelector(".confirm-dialog-overlay");
    this.confirmYesBtn = document.getElementById("confirmYes");
    this.confirmNoBtn = document.getElementById("confirmNo");

    this.initializeEventListeners();
    this.updateRecordList(); // 初始化时显示已保存的记录
    this.setupRecordControls(); // 设置记录控制按钮
    this.initializeAgenda(); // 初始化议程
    this.restoreState(); // 恢复状态

    this.keydownHandler = this.handleKeydown.bind(this);
  }

  // 从localStorage加载记录
  loadRecords() {
    try {
      const saved = localStorage.getItem("timerRecords");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("加载记录失败:", error);
      return [];
    }
  }

  // 保存记录到localStorage
  saveRecords() {
    try {
      const data = JSON.stringify(this.records);
      localStorage.setItem("timerRecords", data);
    } catch (error) {
      console.error("保存记录失败:", error);
      
      // 检测是否是配额超限错误
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        alert(this.getLocalizedText(
          "存储空间已满！请清空部分记录后再试。",
          "Storage quota exceeded! Please clear some records."
        ));
      } else {
        // 其他错误（如隐私模式）
        alert(this.getLocalizedText(
          "无法保存记录。请检查浏览器设置是否允许存储数据。",
          "Cannot save records. Please check browser storage settings."
        ));
      }
    }
  }

  // 保存当前计时状态
  saveState() {
    if (!this.startTime && !this.isAgendaMode) return;

    try {
      const state = {
        startTime: this.startTime,
        initialTime: this.initialTime,
        isRunning: this.isRunning,
        isOvertime: this.isOvertime,
        overtimeStart: this.overtimeStart,
        pauseTime: this.pauseTime,
        currentSpeakerIndex: this.currentSpeakerIndex,
        isAgendaMode: this.isAgendaMode,
        speakerName: this.speakerNameInput.value,
        minutes: this.minutesInput.value,
        seconds: this.secondsInput.value,
        timestamp: Date.now(),
      };
      localStorage.setItem("timerState", JSON.stringify(state));
    } catch (error) {
      console.error("保存状态失败:", error);
      // 状态保存失败不影响计时器运行，静默处理
    }
  }

  // 恢复计时状态
  restoreState() {
    try {
      const saved = localStorage.getItem("timerState");
      if (!saved) return;

      const state = JSON.parse(saved);

      // 12小时过期检查
      if (Date.now() - state.timestamp > 12 * 60 * 60 * 1000) {
        localStorage.removeItem("timerState");
        return;
      }

      this.initialTime = state.initialTime;
      this.startTime = state.startTime;
      this.overtimeStart = state.overtimeStart;
      this.pauseTime = state.pauseTime;
      this.isAgendaMode = state.isAgendaMode || false;
      this.currentSpeakerIndex = state.currentSpeakerIndex || 0;

      this.speakerNameInput.value = state.speakerName || "";
      this.minutesInput.value = state.minutes || 10;
      this.secondsInput.value = state.seconds || 0;

      this.isStateRestored = true;

      // 恢复运行时状态处理
      if (state.isRunning) {
        this.isRunning = true;

        // 检查是否在关闭期间进入超时
        if (!state.isOvertime) {
          const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
          if (elapsed >= this.initialTime) {
            this.isOvertime = true;
            this.overtimeStart = this.startTime + this.initialTime * 1000;
          }
        }

        this.updateButtonStates();
        this.updateTimer(); // 立即更新一次
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
      } else if (state.pauseTime) {
        // 暂停状态恢复
        this.isRunning = false;
        this.isOvertime = state.isOvertime;
        this.updateDisplay(); // 基于 pauseTime 更新显示
        this.updateButtonStates();
        this.showConfirmDialog();
      }
    } catch (error) {
      console.error("恢复状态失败:", error);
      localStorage.removeItem("timerState");
    }
  }

  initializeEventListeners() {
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.confirmStop());

    this.confirmYesBtn.addEventListener("click", () => {
      this.confirmYesBtn.clicked = true;
      this.hideConfirmDialog();

      // 根据当前操作执行相应的动作
      if (this.currentAction === 'clearRecords') {
        this.executeClearRecords();
      } else if (this.currentAction === 'deleteRecord') {
        this.executeDeleteRecord();
      } else {
        this.stop();
      }

      // 重置当前操作
      delete this.currentAction;
    });

    this.confirmNoBtn.addEventListener("click", () => {
      this.confirmYesBtn.clicked = false;
      this.hideConfirmDialog();
      // 重置当前操作
      delete this.currentAction;
    });

    // 添加键盘快捷键支持
    document.addEventListener("keydown", (event) => {
      // 避免在输入框中触发
      if (event.target.tagName === "INPUT") return;

      switch (event.key) {
        case " ": // 空格键开始/停止
          event.preventDefault();
          if (this.isRunning) {
            this.confirmStop();
          } else {
            this.start();
          }
          break;
        case "Escape": // ESC键重置
          if (!this.isRunning) {
            this.reset();
          }
          break;
      }
    });

    // 输入框数值验证
    this.minutesInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      if (value < 0) e.target.value = 0;
      if (value > 999) e.target.value = 999;
    });

    this.secondsInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      if (value < 0) e.target.value = 0;
      if (value > 59) e.target.value = 59;
    });

    // 实时同步议程修改
    const syncInputs = [
      this.speakerNameInput,
      this.minutesInput,
      this.secondsInput,
    ];
    syncInputs.forEach((input) => {
      input.addEventListener("input", () => this.syncToAgenda());
    });

    // 页面关闭/隐藏时保存状态
    window.addEventListener("beforeunload", () => this.saveState());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") this.saveState();
    });
  }

  syncToAgenda() {
    if (this.isAgendaMode && this.agendaSpeakers[this.currentSpeakerIndex]) {
      const speaker = this.agendaSpeakers[this.currentSpeakerIndex];
      speaker.name = this.speakerNameInput.value;
      speaker.minutes = parseInt(this.minutesInput.value) || 0;
      speaker.seconds = parseInt(this.secondsInput.value) || 0;

      // Sync to AgendaManager if available
      if (window.agendaManager) {
        window.agendaManager.syncFromTimer(this.agendaSpeakers);
      }
    }
  }

  // 获取本地化文本的辅助方法
  getLocalizedText(zhText, enText) {
    const currentLang = localStorage.getItem("language") || "zh";
    return currentLang === "zh" ? zhText : enText;
  }

  showConfirmDialog() {
    // 设置默认的停止计时确认文本（支持国际化）
    if (!this.currentAction) {
      this.confirmDialog.querySelector('p').textContent = 
        this.getLocalizedText("确定结束计时吗？", "Stop timing?");
      this.confirmYesBtn.textContent = 
        this.getLocalizedText("确定", "Confirm");
      this.confirmNoBtn.textContent = 
        this.getLocalizedText("取消", "Cancel");
    }

    this.confirmDialog.style.display = "block";
    this.confirmOverlay.style.display = "block";
    document.addEventListener("keydown", this.keydownHandler);
  }

  hideConfirmDialog() {
    this.confirmDialog.style.display = "none";
    this.confirmOverlay.style.display = "none";
    document.removeEventListener("keydown", this.keydownHandler);

    // 只在暂停/停止计时场景下恢复计时状态
    // 在清空记录或删除记录场景下不需要执行这些操作
    if (!this.confirmYesBtn.clicked && !this.currentAction) {
      this.startTime += Date.now() - this.pauseTime;
      this.isRunning = true;
      this.updateButtonStates();
      this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }

    // 注意：不要在这里删除 currentAction！
    // 因为确认按钮的事件处理程序需要在 hideConfirmDialog() 之后检查它
    // currentAction 会在事件处理程序中被清理
    delete this.recordIndexToDelete;
  }

  handleKeydown(event) {
    if (event.key === "Enter") {
      this.confirmYesBtn.clicked = true;
      this.hideConfirmDialog();

      // 根据当前操作执行相应的动作
      if (this.currentAction === 'clearRecords') {
        this.executeClearRecords();
      } else if (this.currentAction === 'deleteRecord') {
        this.executeDeleteRecord();
      } else {
        this.stop();
      }

      // 重置当前操作
      delete this.currentAction;
    }
  }

  start() {
    if (!this.isRunning) {
      const minutes = Math.max(0, parseInt(this.minutesInput.value) || 0);
      const seconds = Math.max(
        0,
        Math.min(59, parseInt(this.secondsInput.value) || 0),
      );

      this.timeLeft = minutes * 60 + seconds;

      // 验证时间输入的有效性
      if (this.timeLeft <= 0) {
        alert("请设置有效的时间（大于0秒）");
        return;
      }

      this.initialTime = this.timeLeft;
      this.startTime = Date.now() - (this.initialTime - this.timeLeft) * 1000;
    }

    this.isRunning = true;
    this.updateButtonStates();

    this.intervalId = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);

    if (!this.isOvertime) {
      this.timeLeft = this.initialTime - elapsedSeconds;

      if (this.timeLeft <= 0) {
        // 超时处理
        this.isOvertime = true;
        this.overtimeStart = Date.now();
        this.timeLeft = Math.abs(this.timeLeft);
        this.timerElement.style.color = "red";
        this.timerElement.classList.remove("warning-animation");
        this.timerElement.classList.add("overtime-animation");
        this.updateOvertimeAnimation();
      } else if (this.timeLeft <= 60) {
        // 最后一分钟警告
        this.timerElement.style.removeProperty("color"); // 移除直接设置的颜色
        this.timerElement.classList.remove("overtime-animation");
        this.timerElement.classList.add("warning-animation");
      } else {
        // 正常状态
        this.timerElement.style.color = "white";
        this.timerElement.classList.remove("warning-animation");
        this.timerElement.classList.remove("overtime-animation");
      }
    } else {
      this.timeLeft = Math.abs(this.initialTime - elapsedSeconds);
      this.updateOvertimeAnimation();
    }

    this.updateDisplay();
  }

  updateOvertimeAnimation() {
    if (!this.isOvertime) return;

    const overtimeMinutes = (Date.now() - this.overtimeStart) / (1000 * 60);

    if (overtimeMinutes >= 5) {
      // 5分钟后保持最强烈的效果
      this.timerElement.style.setProperty("--scale-factor", "0.8");
      this.timerElement.style.setProperty("--blink-duration", "0.7s");
    } else {
      // 线性插值计算缩放和周期
      // 缩放：从0.92到0.8
      const scale = 0.92 - (0.12 * overtimeMinutes) / 5;
      // 周期：从1s到0.7s
      const duration = 1 - (0.3 * overtimeMinutes) / 5;

      this.timerElement.style.setProperty("--scale-factor", scale.toFixed(3));
      this.timerElement.style.setProperty(
        "--blink-duration",
        `${duration.toFixed(2)}s`,
      );
    }
  }

  updateDisplay() {
    let displaySeconds = this.timeLeft;

    // 如果是暂停状态，应该显示暂停时的剩余时间
    if (!this.isRunning && this.pauseTime && this.startTime) {
      const elapsed = Math.floor((this.pauseTime - this.startTime) / 1000);
      if (this.isOvertime) {
        displaySeconds = Math.abs(this.initialTime - elapsed);
      } else {
        displaySeconds = this.initialTime - elapsed;
      }
    }

    const minutes = Math.floor(displaySeconds / 60);
    const seconds = displaySeconds % 60;

    // 只更新数字部分，保持结构不变
    this.timerElement.querySelector(".timer-minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    this.timerElement.querySelector(".timer-seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  confirmStop() {
    clearInterval(this.intervalId);
    this.pauseTime = Date.now();
    this.isRunning = false;
    this.updateButtonStates();
    this.updateDisplay();
    this.showConfirmDialog();
  }

  stop() {
    // 如果当前操作是清空记录，则不添加新的记录
    if (this.currentAction === 'clearRecords') {
      this.reset();
      return;
    }

    const endTime = this.pauseTime;
    const totalTime = Math.floor((endTime - this.startTime) / 1000);
    const overtimeSeconds = Math.max(0, totalTime - this.initialTime);
    const speakerName = this.speakerNameInput.value.trim() || "未命名";

    this.records.push({
      speakerName,
      totalTime,
      overtimeSeconds,
      timestamp: new Date().toLocaleString(),
    });

    this.saveRecords(); // 保存到localStorage
    this.updateRecordList();
    this.reset();

    // 议程模式下自动切换到下一位演讲者
    if (this.isAgendaMode) {
      this.autoNextSpeaker();
    }
  }

  reset() {
    // 清理定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    localStorage.removeItem("timerState");

    // 重置状态
    this.isRunning = false;
    this.isOvertime = false;
    this.timeLeft = 0;
    this.overtimeStart = null;
    this.startTime = null;
    this.pauseTime = null;

    // 重置样式
    this.timerElement.style.color = "white";
    this.timerElement.classList.remove(
      "overtime-animation",
      "warning-animation",
    );
    this.timerElement.style.removeProperty("--scale-factor");
    this.timerElement.style.removeProperty("--blink-duration");

    // 更新界面
    this.updateButtonStates();
    this.updateDisplay();

    // 清空演讲者输入框（非议程模式）
    if (!this.isAgendaMode) {
      this.speakerNameInput.value = "";
    }
  }

  updateButtonStates() {
    this.startBtn.disabled = this.isRunning;
    this.stopBtn.disabled = !this.isRunning;
    this.minutesInput.disabled = this.isRunning;
    this.secondsInput.disabled = this.isRunning;
    this.speakerNameInput.disabled = this.isRunning;
  }

  updateRecordList() {
    this.recordList.innerHTML = this.records
      .map((record, index) => {
        const speakerName = this.escapeHtml(record.speakerName);
        const totalMinutes = Math.floor(record.totalTime / 60);
        const totalSeconds = record.totalTime % 60;
        const overtimeMinutes = Math.floor(record.overtimeSeconds / 60);
        const overtimeSeconds = record.overtimeSeconds % 60;

        const overtimeText =
          record.overtimeSeconds > 0
            ? `<span style="color: #ff4444">· 超时${overtimeMinutes}分${overtimeSeconds}秒</span>`
            : `· 准时完成`;

        return `
                <div class="record-item">
                    <span class="record-content">${speakerName} [${index + 1}] · 时长${totalMinutes}分${totalSeconds}秒 ${overtimeText}</span>
                    <button class="delete-record-btn" onclick="timeKeeper.deleteRecord(${index})" title="删除记录">×</button>
                </div>
            `;
      })
      .join("");
  }

  // HTML转义函数，防止XSS
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // 删除指定记录
  deleteRecord(index) {
    this.showDeleteConfirmDialog(index);
  }

  // 显示删除单条记录的确认对话框
  showDeleteConfirmDialog(index) {
    // 更新对话框文本（支持国际化）
    this.confirmDialog.querySelector('p').textContent = 
      this.getLocalizedText("确定要删除这条记录吗？", "Delete this record?");
    this.confirmYesBtn.textContent = 
      this.getLocalizedText("确定", "Confirm");
    this.confirmNoBtn.textContent = 
      this.getLocalizedText("取消", "Cancel");

    // 临时存储记录索引和操作类型
    this.currentAction = 'deleteRecord';
    this.recordIndexToDelete = index;

    this.showConfirmDialog();
  }

  // 执行删除记录操作
  executeDeleteRecord() {
    this.records.splice(this.recordIndexToDelete, 1);
    this.saveRecords();
    this.updateRecordList();

    // 清理临时变量
    delete this.recordIndexToDelete;
  }

  // 显示清空确认对话框
  showClearConfirmDialog() {
    // 更新对话框文本（支持国际化）
    this.confirmDialog.querySelector('p').textContent = 
      this.getLocalizedText(
        "确定要清空所有记录吗？此操作不可恢复！", 
        "Clear all records? This action cannot be undone!"
      );
    this.confirmYesBtn.textContent = 
      this.getLocalizedText("确定", "Confirm");
    this.confirmNoBtn.textContent = 
      this.getLocalizedText("取消", "Cancel");

    // 设置当前操作标志
    this.currentAction = 'clearRecords';

    // 显示对话框
    this.showConfirmDialog();
  }

  // 清空所有记录
  clearAllRecords() {
    this.showClearConfirmDialog();
  }

  // 执行清空记录操作
  executeClearRecords() {
    this.records = [];
    this.saveRecords();
    this.updateRecordList();
  }

  // 导出记录为CSV
  exportRecords() {
    if (this.records.length === 0) {
      alert("没有记录可导出");
      return;
    }

    try {
      const csvContent = [
        ["演讲者", "总时长(分:秒)", "超时时长(分:秒)", "记录时间"],
        ...this.records.map((record) => {
          const totalMin = Math.floor(record.totalTime / 60);
          const totalSec = record.totalTime % 60;
          const overtimeMin = Math.floor(record.overtimeSeconds / 60);
          const overtimeSec = record.overtimeSeconds % 60;

          return [
            `"${record.speakerName.replace(/"/g, '""')}"`, // 处理CSV中的引号
            `${totalMin}:${totalSec.toString().padStart(2, "0")}`,
            record.overtimeSeconds > 0
              ? `${overtimeMin}:${overtimeSec.toString().padStart(2, "0")}`
              : "0:00",
            record.timestamp,
          ];
        }),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `演讲记录_${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 清理URL对象
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("导出失败:", error);
      alert("导出失败，请重试");
    }
  }

  // 设置记录控制按钮事件
  setupRecordControls() {
    const exportBtn = document.querySelector(".export-btn");
    const clearBtn = document.querySelector(".clear-btn");

    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exportRecords();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clearAllRecords();
      });
    }
  }

  // 初始化议程模式
  initializeAgenda() {
    const config = window.TIMEKEEPER_CONFIG;
    if (
      config &&
      config.speakers &&
      Array.isArray(config.speakers) &&
      config.speakers.length > 0
    ) {
      this.agendaSpeakers = config.speakers;
      this.isAgendaMode = true;
      this.setupAgendaMode();
    } else {
      this.isAgendaMode = false;
    }
  }

  // 设置议程模式
  setupAgendaMode() {
    // 设置第一个演讲者
    this.setCurrentSpeaker(0);
  }

  // 设置当前演讲者
  setCurrentSpeaker(index) {
    if (
      !this.isAgendaMode ||
      index < 0 ||
      index >= this.agendaSpeakers.length
    ) {
      return;
    }

    this.currentSpeakerIndex = index;
    const speaker = this.agendaSpeakers[index];

    // 更新输入框
    this.speakerNameInput.value = speaker.name;
    this.minutesInput.value = speaker.minutes || 0;
    this.secondsInput.value = (speaker.seconds || 0)
      .toString()
      .padStart(2, "0");
  }

  // 自动进入下一位演讲者
  autoNextSpeaker() {
    if (this.isAgendaMode) {
      if (this.currentSpeakerIndex < this.agendaSpeakers.length - 1) {
        // 还有下一位演讲者，自动切换
        setTimeout(() => {
          this.setCurrentSpeaker(this.currentSpeakerIndex + 1);
        }, 1000); // 1秒后自动切换到下一位
      } else {
        // 议程全部完成，回到普通模式
        setTimeout(() => {
          this.exitAgendaMode();
        }, 1000); // 1秒后退出议程模式
      }
    }
  }

  // 退出议程模式，回到普通模式
  exitAgendaMode() {
    this.isAgendaMode = false;
    this.currentSpeakerIndex = 0;
    this.agendaSpeakers = [];

    // 清空输入框，恢复普通模式
    this.speakerNameInput.value = "";
    this.minutesInput.value = "10";
    this.secondsInput.value = "00";

    // 恢复输入框的可编辑状态
    this.updateButtonStates();
  }
}

// 初始化计时器
window.timeKeeper = new Timer();
