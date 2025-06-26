// 数独游戏核心逻辑

class SudokuGame {
    constructor() {
        this.gameBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells = Array(9).fill().map(() => Array(9).fill(false));
        this.selectedCell = null;
        this.pencilMode = false;
        this.pencilMarks = Array(9).fill().map(() => Array(9).fill().map(() => Array(9).fill(false)));
        this.gameTimer = 0;
        this.timerInterval = null;
        this.hintsLeft = 5;
        this.gameHistory = [];
        this.historyIndex = -1;
        this.currentDifficulty = 'medium';
        this.isGameCompleted = false;
        this.isPaused = false;
        
        // 游戏数据
        this.gameData = {
            totalStars: 0,
            currentStreak: 0,
            dailyChallenge: {
                completed: false,
                date: null,
                streak: 0
            },
            achievements: [],
            stats: {
                totalGameTime: 0,
                completedPuzzles: 0,
                consecutiveCheckin: 0
            },
            settings: {
                sound: true,
                errorHighlight: true,
                autoSave: true,
                theme: 'default',
                language: 'zh'
            }
        };
    }

    // 生成完整的数独解决方案
    generateSolution() {
        // 清空数组
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        
        // 使用回溯算法生成完整解决方案
        this.solveSudoku(this.solution);
        return this.solution;
    }

    // 回溯算法求解数独
    solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    // 随机打乱数字顺序以增加随机性
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (let num of numbers) {
                        if (this.isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (this.solveSudoku(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    
                    return false;
                }
            }
        }
        return true;
    }

    // 打乱数组
    shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    // 验证移动是否有效
    isValidMove(board, row, col, num) {
        // 检查行
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }

        // 检查列
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }

        // 检查3x3方格
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    // 根据难度生成谜题
    generatePuzzle(difficulty = 'medium') {
        // 生成完整解决方案
        this.generateSolution();
        
        // 复制解决方案到游戏板
        this.gameBoard = this.solution.map(row => [...row]);
        
        // 根据难度移除数字
        const cellsToRemove = this.getDifficultySettings(difficulty).cellsToRemove;
        const totalCells = 81;
        const cellsToKeep = totalCells - cellsToRemove;
        
        // 随机选择要保留的格子
        const positions = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                positions.push([row, col]);
            }
        }
        
        // 打乱位置
        this.shuffleArray(positions);
        
        // 保留前cellsToKeep个位置的数字
        this.givenCells = Array(9).fill().map(() => Array(9).fill(false));
        
        for (let i = 0; i < cellsToKeep; i++) {
            const [row, col] = positions[i];
            this.givenCells[row][col] = true;
        }
        
        // 移除其他位置的数字
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (!this.givenCells[row][col]) {
                    this.gameBoard[row][col] = 0;
                }
            }
        }
        
        this.currentDifficulty = difficulty;
        this.isGameCompleted = false;
        this.saveState();
    }

    // 获取难度设置
    getDifficultySettings(difficulty) {
        const settings = {
            easy: { cellsToRemove: 35, name: '简单', stars: 1 },
            medium: { cellsToRemove: 45, name: '中等', stars: 2 },
            hard: { cellsToRemove: 55, name: '困难', stars: 3 },
            expert: { cellsToRemove: 65, name: '专家', stars: 5 }
        };
        return settings[difficulty] || settings.medium;
    }

    // 放置数字
    placeNumber(row, col, num) {
        if (this.givenCells[row][col] || this.isGameCompleted) return false;
        
        this.saveState();
        
        if (this.pencilMode) {
            // 铅笔模式
            this.pencilMarks[row][col][num - 1] = !this.pencilMarks[row][col][num - 1];
        } else {
            // 普通模式
            this.gameBoard[row][col] = num;
            // 清除该格子的铅笔标记
            this.pencilMarks[row][col] = Array(9).fill(false);
            
            // 检查是否完成
            if (this.checkCompletion()) {
                this.completeGame();
            }
        }
        
        return true;
    }

    // 清除格子
    clearCell(row, col) {
        if (this.givenCells[row][col] || this.isGameCompleted) return false;
        
        this.saveState();
        this.gameBoard[row][col] = 0;
        this.pencilMarks[row][col] = Array(9).fill(false);
        return true;
    }

    // 检查游戏是否完成
    checkCompletion() {
        // 检查是否所有格子都填满
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.gameBoard[row][col] === 0) return false;
            }
        }
        
        // 检查是否符合数独规则
        return this.isValidSolution();
    }

    // 验证解决方案是否正确
    isValidSolution() {
        // 检查所有行、列、3x3方格
        for (let i = 0; i < 9; i++) {
            if (!this.isValidUnit(this.getRow(i)) ||
                !this.isValidUnit(this.getColumn(i)) ||
                !this.isValidUnit(this.getBox(i))) {
                return false;
            }
        }
        return true;
    }

    // 验证单元（行、列或3x3方格）是否有效
    isValidUnit(unit) {
        const seen = new Set();
        for (let num of unit) {
            if (num !== 0) {
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }

    // 获取行
    getRow(rowIndex) {
        return this.gameBoard[rowIndex];
    }

    // 获取列
    getColumn(colIndex) {
        return this.gameBoard.map(row => row[colIndex]);
    }

    // 获取3x3方格
    getBox(boxIndex) {
        const box = [];
        const startRow = Math.floor(boxIndex / 3) * 3;
        const startCol = (boxIndex % 3) * 3;
        
        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
                box.push(this.gameBoard[row][col]);
            }
        }
        return box;
    }

    // 使用提示
    useHint() {
        if (this.hintsLeft <= 0 || this.isGameCompleted) return null;
        
        // 寻找空格子
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.gameBoard[row][col] === 0) {
                    emptyCells.push([row, col]);
                }
            }
        }
        
        if (emptyCells.length === 0) return null;
        
        // 随机选择一个空格子
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];
        
        // 从解决方案中获取正确答案
        const correctNum = this.solution[row][col];
        
        this.saveState();
        this.gameBoard[row][col] = correctNum;
        this.hintsLeft--;
        
        // 检查是否完成
        if (this.checkCompletion()) {
            this.completeGame();
        }
        
        return { row, col, num: correctNum };
    }

    // 保存状态（用于撤销/重做）
    saveState() {
        // 限制历史记录长度
        if (this.historyIndex < this.gameHistory.length - 1) {
            this.gameHistory = this.gameHistory.slice(0, this.historyIndex + 1);
        }
        
        const state = {
            gameBoard: this.gameBoard.map(row => [...row]),
            pencilMarks: this.pencilMarks.map(row => row.map(cell => [...cell])),
            hintsLeft: this.hintsLeft
        };
        
        this.gameHistory.push(state);
        this.historyIndex++;
        
        // 限制历史记录数量
        if (this.gameHistory.length > 50) {
            this.gameHistory.shift();
            this.historyIndex--;
        }
    }

    // 撤销
    undo() {
        if (this.historyIndex <= 0) return false;
        
        this.historyIndex--;
        const state = this.gameHistory[this.historyIndex];
        
        this.gameBoard = state.gameBoard.map(row => [...row]);
        this.pencilMarks = state.pencilMarks.map(row => row.map(cell => [...cell]));
        this.hintsLeft = state.hintsLeft;
        
        return true;
    }

    // 重做
    redo() {
        if (this.historyIndex >= this.gameHistory.length - 1) return false;
        
        this.historyIndex++;
        const state = this.gameHistory[this.historyIndex];
        
        this.gameBoard = state.gameBoard.map(row => [...row]);
        this.pencilMarks = state.pencilMarks.map(row => row.map(cell => [...cell]));
        this.hintsLeft = state.hintsLeft;
        
        return true;
    }

    // 开始计时
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.gameTimer++;
            }
        }, 1000);
    }

    // 停止计时
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // 暂停/恢复游戏
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    // 格式化时间
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 完成游戏
    completeGame() {
        this.isGameCompleted = true;
        this.stopTimer();
        
        // 计算奖励
        const difficultySettings = this.getDifficultySettings(this.currentDifficulty);
        const baseStars = difficultySettings.stars;
        const timeBonus = this.gameTimer < 300 ? 1 : 0; // 5分钟内完成额外奖励
        const hintsBonus = this.hintsLeft >= 3 ? 1 : 0; // 使用少于3个提示额外奖励
        
        const totalStars = baseStars + timeBonus + hintsBonus;
        
        // 更新游戏数据
        this.gameData.totalStars += totalStars;
        this.gameData.stats.completedPuzzles++;
        this.gameData.stats.totalGameTime += this.gameTimer;
        
        // 检查成就
        this.checkAchievements();
        
        return {
            time: this.gameTimer,
            formattedTime: this.formatTime(this.gameTimer),
            stars: totalStars,
            difficulty: this.currentDifficulty
        };
    }

    // 检查成就
    checkAchievements() {
        const achievements = [];
        
        // 新手解谜者
        if (this.gameData.stats.completedPuzzles >= 10 && 
            !this.gameData.achievements.includes('beginner_solver')) {
            achievements.push('beginner_solver');
        }
        
        // 数独大师
        if (this.gameData.stats.completedPuzzles >= 50 && 
            !this.gameData.achievements.includes('sudoku_master')) {
            achievements.push('sudoku_master');
        }
        
        // 添加新成就
        achievements.forEach(achievement => {
            if (!this.gameData.achievements.includes(achievement)) {
                this.gameData.achievements.push(achievement);
            }
        });
        
        return achievements;
    }

    // 重置游戏
    reset() {
        this.gameBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells = Array(9).fill().map(() => Array(9).fill(false));
        this.selectedCell = null;
        this.pencilMode = false;
        this.pencilMarks = Array(9).fill().map(() => Array(9).fill().map(() => Array(9).fill(false)));
        this.gameTimer = 0;
        this.hintsLeft = 5;
        this.gameHistory = [];
        this.historyIndex = -1;
        this.isGameCompleted = false;
        this.isPaused = false;
        this.stopTimer();
    }

    // 保存游戏数据
    saveGameData() {
        try {
            localStorage.setItem('sudokuGameData', JSON.stringify(this.gameData));
            localStorage.setItem('sudokuCurrentGame', JSON.stringify({
                gameBoard: this.gameBoard,
                solution: this.solution,
                givenCells: this.givenCells,
                pencilMarks: this.pencilMarks,
                gameTimer: this.gameTimer,
                hintsLeft: this.hintsLeft,
                difficulty: this.currentDifficulty,
                isCompleted: this.isGameCompleted
            }));
        } catch (e) {
            console.error('Failed to save game data:', e);
        }
    }

    // 加载游戏数据
    loadGameData() {
        try {
            const savedData = localStorage.getItem('sudokuGameData');
            if (savedData) {
                this.gameData = { ...this.gameData, ...JSON.parse(savedData) };
            }
            
            const currentGame = localStorage.getItem('sudokuCurrentGame');
            if (currentGame) {
                const gameState = JSON.parse(currentGame);
                this.gameBoard = gameState.gameBoard || this.gameBoard;
                this.solution = gameState.solution || this.solution;
                this.givenCells = gameState.givenCells || this.givenCells;
                this.pencilMarks = gameState.pencilMarks || this.pencilMarks;
                this.gameTimer = gameState.gameTimer || 0;
                this.hintsLeft = gameState.hintsLeft || 5;
                this.currentDifficulty = gameState.difficulty || 'medium';
                this.isGameCompleted = gameState.isCompleted || false;
                return true;
            }
        } catch (e) {
            console.error('Failed to load game data:', e);
        }
        return false;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudokuGame;
} 