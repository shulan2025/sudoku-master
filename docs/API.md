# 数独大师 - API 文档

## 核心类

### SudokuGame

游戏逻辑核心类，处理数独生成、验证、游戏状态管理等功能。

#### 构造函数

```javascript
const game = new SudokuGame();
```

#### 主要属性

- `gameBoard`: 当前游戏板状态（9x9数组）
- `solution`: 完整解决方案（9x9数组）
- `givenCells`: 标记哪些格子是题目给定的（9x9布尔数组）
- `selectedCell`: 当前选中的格子 `{row, col}`
- `pencilMode`: 是否处于铅笔模式
- `gameTimer`: 游戏计时器（秒）
- `hintsLeft`: 剩余提示次数
- `currentDifficulty`: 当前难度等级
- `isGameCompleted`: 游戏是否完成

#### 主要方法

##### 游戏控制

```javascript
// 生成新的数独谜题
game.generatePuzzle(difficulty)
// difficulty: 'easy' | 'medium' | 'hard' | 'expert'

// 重置游戏
game.reset()

// 开始计时
game.startTimer()

// 停止计时
game.stopTimer()

// 暂停/恢复游戏
game.togglePause()
```

##### 游戏操作

```javascript
// 放置数字
game.placeNumber(row, col, num)
// 返回: boolean (是否成功放置)

// 清除格子
game.clearCell(row, col)
// 返回: boolean (是否成功清除)

// 使用提示
game.useHint()
// 返回: {row, col, num} | null

// 撤销操作
game.undo()
// 返回: boolean (是否成功撤销)

// 重做操作
game.redo()
// 返回: boolean (是否成功重做)
```

##### 验证

```javascript
// 检查游戏是否完成
game.checkCompletion()
// 返回: boolean

// 验证移动是否有效
game.isValidMove(board, row, col, num)
// 返回: boolean

// 验证解决方案是否正确
game.isValidSolution()
// 返回: boolean
```

##### 数据管理

```javascript
// 保存游戏数据
game.saveGameData()

// 加载游戏数据
game.loadGameData()
// 返回: boolean (是否成功加载)

// 格式化时间
game.formatTime(seconds)
// 返回: string (MM:SS格式)
```

### SudokuUI

用户界面控制类，处理DOM操作、事件处理、显示更新等。

#### 构造函数

```javascript
const ui = new SudokuUI();
```

#### 主要属性

- `game`: SudokuGame实例
- `currentLanguage`: 当前语言设置
- `currentPage`: 当前页面

#### 主要方法

##### 初始化

```javascript
// 初始化UI
ui.init()

// 创建游戏板
ui.createBoard()

// 创建数字面板
ui.createNumberPad()

// 设置事件监听器
ui.setupEventListeners()
```

##### 游戏交互

```javascript
// 选择格子
ui.selectCell(row, col)

// 选择数字
ui.selectNumber(num)

// 开始新游戏
ui.startNewGame(difficulty)

// 使用提示
ui.useHint()

// 切换铅笔模式
ui.togglePencilMode()
```

##### 显示更新

```javascript
// 更新游戏板显示
ui.updateBoard()

// 更新所有显示
ui.updateAllDisplays()

// 更新语言
ui.updateLanguage()

// 更新计时器显示
ui.updateTimer()
```

##### 页面管理

```javascript
// 切换页面
ui.switchPage(pageName)
// pageName: 'game' | 'challenge' | 'trophy' | 'shop' | 'settings'

// 更新挑战显示
ui.updateChallengeDisplay()

// 更新奖杯显示
ui.updateTrophyDisplay()
```

## 翻译系统

### translations 对象

包含所有支持语言的翻译数据：

```javascript
const translations = {
    zh: { /* 中文翻译 */ },
    en: { /* 英文翻译 */ },
    ja: { /* 日文翻译 */ },
    de: { /* 德文翻译 */ },
    hi: { /* 印地语翻译 */ },
    ru: { /* 俄文翻译 */ },
    fr: { /* 法文翻译 */ }
};
```

### 使用翻译

```javascript
// 获取当前语言的翻译
const t = translations[currentLanguage] || translations.zh;

// 使用翻译
const text = t.newGame; // "新游戏" 或 "New Game"
```

## 事件系统

### 键盘事件

- `1-9`: 输入数字
- `Delete/Backspace`: 清除格子
- `P`: 切换铅笔模式
- `H`: 使用提示
- `Space`: 暂停游戏
- `Ctrl+Z`: 撤销
- `Ctrl+Y`: 重做

### 自定义事件

游戏完成时触发的事件：

```javascript
// 监听游戏完成事件
document.addEventListener('gameCompleted', (event) => {
    const { time, stars, difficulty } = event.detail;
    console.log(`游戏完成! 用时: ${time}, 获得星星: ${stars}, 难度: ${difficulty}`);
});
```

## 存储格式

### LocalStorage 数据结构

#### 游戏数据 (sudokuGameData)

```javascript
{
    totalStars: number,
    currentStreak: number,
    dailyChallenge: {
        completed: boolean,
        date: string,
        streak: number
    },
    achievements: string[],
    stats: {
        totalGameTime: number,
        completedPuzzles: number,
        consecutiveCheckin: number
    },
    settings: {
        sound: boolean,
        errorHighlight: boolean,
        autoSave: boolean,
        theme: string,
        language: string
    }
}
```

#### 当前游戏状态 (sudokuCurrentGame)

```javascript
{
    gameBoard: number[][],
    solution: number[][],
    givenCells: boolean[][],
    pencilMarks: boolean[][][],
    gameTimer: number,
    hintsLeft: number,
    difficulty: string,
    isCompleted: boolean
}
```

## 错误处理

### 常见错误及处理

```javascript
// 数据加载失败
try {
    game.loadGameData();
} catch (error) {
    console.error('Failed to load game data:', error);
    // 使用默认数据
}

// 无效移动
const result = game.placeNumber(row, col, num);
if (!result) {
    console.warn('Invalid move');
    // 显示错误提示
}
```

## 扩展开发

### 添加新语言

1. 在 `translations.js` 中添加新的语言对象
2. 在语言选择器中添加新选项
3. 更新语言切换逻辑

```javascript
// 示例：添加西班牙语
translations.es = {
    newGame: "Nuevo Juego",
    hint: "Pista",
    // ... 其他翻译
};
```

### 添加新主题

1. 在CSS中定义新的主题变量
2. 在设置页面添加主题选项
3. 更新主题切换逻辑

```css
/* 示例：深色主题 */
.theme-dark {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
    /* ... 其他颜色变量 */
}
```

### 添加新成就

1. 在 `checkAchievements` 方法中添加新的成就逻辑
2. 在成就页面添加显示
3. 更新翻译文件

```javascript
// 示例：新成就检查
if (game.gameData.stats.totalGameTime > 36000 && // 10小时
    !game.gameData.achievements.includes('time_master')) {
    achievements.push('time_master');
}
``` 