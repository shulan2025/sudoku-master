// 主界面控制和事件处理

class SudokuUI {
    constructor() {
        this.game = new SudokuGame();
        this.currentLanguage = 'zh';
        this.currentPage = 'game';
        
        this.init();
    }

    // 初始化
    init() {
        console.log('Initializing Sudoku UI...');
        
        // 加载游戏数据
        this.game.loadGameData();
        this.currentLanguage = this.game.gameData.settings.language || 'zh';
        
        // 创建游戏板
        this.createBoard();
        
        // 创建数字面板
        this.createNumberPad();
        
        // 设置事件监听器
        this.setupEventListeners();
        
        // 设置页面导航
        this.setupNavigation();
        
        // 检查保存的游戏
        this.checkForSavedGame();
        
        // 开始新游戏（如果没有保存的游戏）
        if (!this.game.loadGameData()) {
            this.startNewGame('medium');
        }
        
        // 初始化每日挑战
        this.initializeDailyChallenge();
        
        // 更新语言
        this.updateLanguage();
        
        // 更新所有显示
        this.updateAllDisplays();
        
        console.log('Sudoku UI initialized successfully!');
    }

    // 创建数独游戏板
    createBoard() {
        console.log('Creating sudoku board...');
        const boardContainer = document.getElementById('sudokuBoard');
        if (!boardContainer) {
            console.error('Board container not found!');
            return;
        }

        boardContainer.innerHTML = '';
        boardContainer.className = 'board';
        
        console.log('Board container created, adding cells...');
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加3x3方格边框
                if (row % 3 === 0) cell.classList.add('border-top');
                if (col % 3 === 0) cell.classList.add('border-left');
                if (row % 3 === 2) cell.classList.add('border-bottom');
                if (col % 3 === 2) cell.classList.add('border-right');
                
                // 添加点击事件
                cell.addEventListener('click', () => this.selectCell(row, col));
                
                boardContainer.appendChild(cell);
            }
        }
        
        console.log('Board created successfully with 81 cells');
    }

    // 创建数字面板
    createNumberPad() {
        const numberPad = document.getElementById('numberPad');
        if (!numberPad) return;

        numberPad.innerHTML = '';
        
        for (let num = 1; num <= 9; num++) {
            const button = document.createElement('button');
            button.className = 'number-btn';
            button.textContent = num;
            button.addEventListener('click', () => this.selectNumber(num));
            numberPad.appendChild(button);
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 新游戏按钮
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.showNewGameModal());
        }

        // 继续游戏按钮
        const continueGameBtn = document.getElementById('continueGameBtn');
        if (continueGameBtn) {
            continueGameBtn.addEventListener('click', () => this.continueGame());
        }

        // 控制按钮
        const buttons = {
            hintBtn: () => this.useHint(),
            pencilBtn: () => this.togglePencilMode(),
            eraseBtn: () => this.eraseCell(),
            undoBtn: () => this.undo(),
            redoBtn: () => this.redo(),
            pauseBtn: () => this.togglePause()
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handler);
        });

        // 语言选择器
        const languageSelector = document.getElementById('languageSelector');
        const settingsLanguageSelector = document.getElementById('settingsLanguageSelector');
        
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.game.gameData.settings.language = this.currentLanguage;
                this.updateLanguage();
                this.updateAllDisplays();
                this.updateChallengeDisplay();
                this.game.saveGameData();
            });
        }

        if (settingsLanguageSelector) {
            settingsLanguageSelector.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.game.gameData.settings.language = this.currentLanguage;
                this.updateLanguage();
                this.updateAllDisplays();
                this.updateChallengeDisplay();
                this.game.saveGameData();
            });
        }

        // 每日挑战按钮
        const challengeStartBtn = document.getElementById('challengeStartBtn');
        if (challengeStartBtn) {
            challengeStartBtn.addEventListener('click', () => this.startDailyChallenge());
        }

        const dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
        if (dailyChallengeBtn) {
            dailyChallengeBtn.addEventListener('click', () => this.startDailyChallenge());
        }

        // 信息区域切换
        const infoToggle = document.getElementById('infoToggle');
        if (infoToggle) {
            infoToggle.addEventListener('click', () => {
                const content = document.getElementById('infoContent');
                const toggle = document.querySelector('.toggle-icon');
                
                if (content) content.classList.toggle('expanded');
                if (toggle) toggle.classList.toggle('rotated');
            });
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // 新游戏模态框
        const newGameModal = document.getElementById('newGameModal');
        if (newGameModal) {
            newGameModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    e.currentTarget.style.display = 'none';
                }
            });
        }

        // 难度选择
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => {
                const difficulty = card.dataset.difficulty;
                this.startNewGame(difficulty);
                const modal = document.getElementById('newGameModal');
                if (modal) modal.style.display = 'none';
            });
        });

        // 自动保存
        setInterval(() => {
            if (this.game.gameData.settings.autoSave) {
                this.game.saveGameData();
            }
        }, 30000);
        
        console.log('Event listeners setup complete');
    }

    // 设置页面导航
    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const pages = document.querySelectorAll('.page');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPage = tab.dataset.page;
                this.switchPage(targetPage);
            });
        });
    }

    // 切换页面
    switchPage(pageName) {
        // 更新导航标签
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // 更新页面显示
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}Page`).classList.add('active');

        this.currentPage = pageName;
        
        // 更新页面特定内容
        if (pageName === 'challenge') {
            this.updateChallengeDisplay();
        } else if (pageName === 'trophy') {
            this.updateTrophyDisplay();
        } else if (pageName === 'shop') {
            this.updateShopDisplay();
        }
    }

    // 选择格子
    selectCell(row, col) {
        // 清除之前的选择
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'highlight');
        });

        // 选择新格子
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
            this.game.selectedCell = { row, col };
            
            // 高亮相关行、列、3x3方格
            this.highlightRelatedCells(row, col);
        }
    }

    // 高亮相关格子
    highlightRelatedCells(row, col) {
        for (let i = 0; i < 9; i++) {
            // 高亮行
            const rowCell = document.querySelector(`[data-row="${row}"][data-col="${i}"]`);
            if (rowCell) rowCell.classList.add('highlight');
            
            // 高亮列
            const colCell = document.querySelector(`[data-row="${i}"][data-col="${col}"]`);
            if (colCell) colCell.classList.add('highlight');
        }

        // 高亮3x3方格
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                const boxCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                if (boxCell) boxCell.classList.add('highlight');
            }
        }
    }

    // 选择数字
    selectNumber(num) {
        if (!this.game.selectedCell) return;
        
        const { row, col } = this.game.selectedCell;
        this.game.placeNumber(row, col, num);
        this.updateBoard();
        this.updateAllDisplays();
        
        // 自动保存
        this.game.saveGameData();
    }

    // 更新游戏板显示
    updateBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (!cell) continue;

                // 清除所有样式类
                cell.classList.remove('given', 'user-input', 'pencil');
                cell.innerHTML = '';

                if (this.game.gameBoard[row][col] !== 0) {
                    // 显示数字
                    cell.textContent = this.game.gameBoard[row][col];
                    
                    if (this.game.givenCells[row][col]) {
                        cell.classList.add('given');
                    } else {
                        cell.classList.add('user-input');
                    }
                } else {
                    // 显示铅笔标记
                    const pencilMarks = this.game.pencilMarks[row][col];
                    const hasMarks = pencilMarks.some(mark => mark);
                    
                    if (hasMarks) {
                        cell.classList.add('pencil');
                        const pencilDiv = document.createElement('div');
                        pencilDiv.className = 'pencil-marks';
                        
                        for (let i = 0; i < 9; i++) {
                            const mark = document.createElement('span');
                            mark.textContent = pencilMarks[i] ? (i + 1) : '';
                            pencilDiv.appendChild(mark);
                        }
                        
                        cell.appendChild(pencilDiv);
                    }
                }
            }
        }
    }

    // 开始新游戏
    startNewGame(difficulty) {
        this.game.reset();
        this.game.generatePuzzle(difficulty);
        this.game.startTimer();
        this.updateBoard();
        this.updateAllDisplays();
        this.game.saveGameData();
    }

    // 继续游戏
    continueGame() {
        if (this.game.loadGameData()) {
            this.game.startTimer();
            this.updateBoard();
            this.updateAllDisplays();
            
            // 隐藏继续按钮
            const continueBtn = document.getElementById('continueGameBtn');
            if (continueBtn) continueBtn.style.display = 'none';
        }
    }

    // 检查保存的游戏
    checkForSavedGame() {
        const savedData = localStorage.getItem('sudokuCurrentGame');
        if (savedData) {
            try {
                const gameState = JSON.parse(savedData);
                if (gameState && gameState.gameBoard) {
                    this.showContinueGameButton(gameState);
                }
            } catch (e) {
                console.error('Error loading saved game:', e);
            }
        }
    }

    // 显示继续游戏按钮
    showContinueGameButton(gameState) {
        const continueBtn = document.getElementById('continueGameBtn');
        const continueDetails = document.getElementById('continueDetails');
        
        if (continueBtn && gameState) {
            // 计算完成百分比
            let filledCells = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (gameState.gameBoard[row][col] !== 0) {
                        filledCells++;
                    }
                }
            }
            const completionPercent = Math.round((filledCells / 81) * 100);
            
            // 更新显示
            const difficultyNames = {
                easy: '简单',
                medium: '中等', 
                hard: '困难',
                expert: '专家'
            };
            
            if (continueDetails) {
                const t = translations[this.currentLanguage] || translations.zh;
                const difficultyName = difficultyNames[gameState.difficulty] || '中等';
                continueDetails.textContent = `${difficultyName}难度 - ${completionPercent}% 完成`;
            }
            continueBtn.style.display = 'block';
        }
    }

    // 使用提示
    useHint() {
        const result = this.game.useHint();
        if (result) {
            this.updateBoard();
            this.updateAllDisplays();
            this.game.saveGameData();
            
            // 高亮提示的格子
            const cell = document.querySelector(`[data-row="${result.row}"][data-col="${result.col}"]`);
            if (cell) {
                cell.classList.add('hint-highlight');
                setTimeout(() => {
                    cell.classList.remove('hint-highlight');
                }, 2000);
            }
        }
    }

    // 切换铅笔模式
    togglePencilMode() {
        this.game.pencilMode = !this.game.pencilMode;
        const pencilBtn = document.getElementById('pencilBtn');
        if (pencilBtn) {
            pencilBtn.classList.toggle('active', this.game.pencilMode);
        }
    }

    // 橡皮擦
    eraseCell() {
        if (!this.game.selectedCell) return;
        
        const { row, col } = this.game.selectedCell;
        this.game.clearCell(row, col);
        this.updateBoard();
        this.updateAllDisplays();
        this.game.saveGameData();
    }

    // 撤销
    undo() {
        if (this.game.undo()) {
            this.updateBoard();
            this.updateAllDisplays();
        }
    }

    // 重做
    redo() {
        if (this.game.redo()) {
            this.updateBoard();
            this.updateAllDisplays();
        }
    }

    // 暂停游戏
    togglePause() {
        const isPaused = this.game.togglePause();
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            const t = translations[this.currentLanguage] || translations.zh;
            pauseBtn.textContent = isPaused ? '⏵️ 继续' : '⏸️ 暂停';
        }
    }

    // 显示新游戏模态框
    showNewGameModal() {
        const modal = document.getElementById('newGameModal');
        if (modal) modal.style.display = 'flex';
    }

    // 处理键盘事件
    handleKeyPress(e) {
        if (e.key >= '1' && e.key <= '9') {
            this.selectNumber(parseInt(e.key));
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.eraseCell();
        } else if (e.key === ' ') {
            e.preventDefault();
            this.togglePause();
        } else if (e.key.toLowerCase() === 'p') {
            this.togglePencilMode();
        } else if (e.key.toLowerCase() === 'h') {
            this.useHint();
        } else if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        }
    }

    // 更新所有显示
    updateAllDisplays() {
        this.updateTimer();
        this.updateStars();
        this.updateStreak();
        this.updateHintsDisplay();
        this.updateDifficultyDisplay();
    }

    // 更新计时器显示
    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.game.formatTime(this.game.gameTimer);
        }
    }

    // 更新星星显示
    updateStars() {
        const starsElement = document.getElementById('totalStars');
        if (starsElement) {
            starsElement.textContent = this.game.gameData.totalStars;
        }
        
        const starBalanceElement = document.getElementById('starBalance');
        if (starBalanceElement) {
            starBalanceElement.textContent = this.game.gameData.totalStars;
        }
    }

    // 更新连续天数显示
    updateStreak() {
        const streakElement = document.getElementById('currentStreak');
        const streakCountElement = document.getElementById('streakCount');
        
        if (streakElement) {
            streakElement.textContent = this.game.gameData.currentStreak;
        }
        if (streakCountElement) {
            streakCountElement.textContent = this.game.gameData.currentStreak;
        }
    }

    // 更新提示次数显示
    updateHintsDisplay() {
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            const t = translations[this.currentLanguage] || translations.zh;
            hintBtn.innerHTML = `💡 ${t.hint} (${this.game.hintsLeft})`;
        }
    }

    // 更新难度显示
    updateDifficultyDisplay() {
        const currentDifficultyElement = document.getElementById('currentDifficulty');
        if (currentDifficultyElement) {
            const t = translations[this.currentLanguage] || translations.zh;
            const difficultyNames = {
                easy: t.easy || '简单',
                medium: t.medium || '中等',
                hard: t.hard || '困难',
                expert: t.expert || '专家'
            };
            currentDifficultyElement.textContent = difficultyNames[this.game.currentDifficulty] || '中等';
        }
    }

    // 初始化每日挑战
    initializeDailyChallenge() {
        const today = new Date().toDateString();
        const challengeData = this.game.gameData.dailyChallenge;
        
        if (challengeData.date !== today) {
            // 新的一天，重置挑战
            challengeData.date = today;
            challengeData.completed = false;
            this.game.saveGameData();
        }
        
        this.updateChallengeDisplay();
    }

    // 开始每日挑战
    startDailyChallenge() {
        // 切换到游戏页面
        this.switchPage('game');
        
        // 开始中等难度的挑战
        this.startNewGame('medium');
        
        // 标记为每日挑战模式
        this.isDailyChallenge = true;
    }

    // 更新挑战显示
    updateChallengeDisplay() {
        const challengeDateElement = document.getElementById('challengeDate');
        const challengeStatusElement = document.getElementById('challengeStatus');
        
        if (challengeDateElement) {
            challengeDateElement.textContent = new Date().toLocaleDateString();
        }
        
        if (challengeStatusElement) {
            const t = translations[this.currentLanguage] || translations.zh;
            const statusText = challengeStatusElement.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = this.game.gameData.dailyChallenge.completed ? 
                    (t.complete || '已完成') : (t.incomplete || '未完成');
            }
        }
    }

    // 更新奖杯页面显示
    updateTrophyDisplay() {
        const totalGameTimeElement = document.getElementById('totalGameTime');
        const completedPuzzlesElement = document.getElementById('completedPuzzles');
        const consecutiveCheckinElement = document.getElementById('consecutiveCheckin');
        
        if (totalGameTimeElement) {
            const hours = Math.floor(this.game.gameData.stats.totalGameTime / 3600);
            const minutes = Math.floor((this.game.gameData.stats.totalGameTime % 3600) / 60);
            totalGameTimeElement.textContent = `${hours}小时${minutes}分钟`;
        }
        
        if (completedPuzzlesElement) {
            completedPuzzlesElement.textContent = `${this.game.gameData.stats.completedPuzzles}个`;
        }
        
        if (consecutiveCheckinElement) {
            consecutiveCheckinElement.textContent = `${this.game.gameData.stats.consecutiveCheckin}天`;
        }
    }

    // 更新商店页面显示
    updateShopDisplay() {
        // 商店显示已经通过updateStars更新了余额
        // 这里可以添加更多商店相关的更新逻辑
    }

    // 更新语言
    updateLanguage() {
        const lang = this.currentLanguage;
        const t = translations[lang] || translations.zh;
        
        console.log('updateLanguage called with language:', lang);
        console.log('Translation object exists:', !!translations[lang]);
        
        // 更新主要按钮和界面元素
        const elements = {
            'newGameBtn': t.newGame,
            'hintBtn': `💡 ${t.hint} (${this.game.hintsLeft})`,
            'pencilBtn': `✏️ ${t.pencilMode}`,
            'eraseBtn': `🗑️ ${t.eraser}`,
            'undoBtn': `↶ ${t.undo}`,
            'redoBtn': `↷ ${t.redo}`,
            'pauseBtn': `⏸️ ${t.pause}`,
            'dailyChallengeNav': `📅 ${t.dailyChallenge}`,
            'trophyNav': `🏆 ${t.trophiesAchievements}`,
            'shopNav': `🛒 ${t.shopExchange}`,
            'settingsNav': `⚙️ ${t.settings}`
        };

        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element && text) {
                element.textContent = text;
            }
        });

        // 更新语言选择器
        if (document.getElementById('languageSelector')) {
            document.getElementById('languageSelector').value = lang;
        }
        if (document.getElementById('settingsLanguageSelector')) {
            document.getElementById('settingsLanguageSelector').value = lang;
        }

        // 更新难度选择器
        this.updateDifficultySelector(t);

        // 更新继续游戏按钮
        const continueGameBtn = document.getElementById('continueGameBtn');
        if (continueGameBtn) {
            const continueText = continueGameBtn.querySelector('.continue-text');
            if (continueText) continueText.textContent = t.continueGame;
        }

        // 更新每日挑战区域
        this.updateDailyChallengeSection(t);

        // 更新信息区域
        this.updateInfoContent(t);

        // 更新页面特定内容
        this.updatePageSpecificContent(t);

        console.log('Language updated to:', this.currentLanguage);
    }

    // 更新难度选择器
    updateDifficultySelector(t) {
        const difficultyOptions = {
            easy: { name: t.easy, desc: t.easyDesc },
            medium: { name: t.medium, desc: t.mediumDesc },
            hard: { name: t.hard, desc: t.hardDesc },
            expert: { name: t.expert, desc: t.expertDesc }
        };

        Object.entries(difficultyOptions).forEach(([difficulty, { name, desc }]) => {
            const option = document.querySelector(`[data-difficulty="${difficulty}"]`);
            if (option) {
                const nameElement = option.querySelector('.difficulty-name');
                const descElement = option.querySelector('.difficulty-desc');
                if (nameElement && name) nameElement.textContent = name;
                if (descElement && desc) descElement.textContent = desc;
            }
        });
    }

    // 更新每日挑战区域
    updateDailyChallengeSection(t) {
        const challengeDesc = document.querySelector('.challenge-header p');
        if (challengeDesc) challengeDesc.textContent = t.dailyChallengeDesc;

        const challengeBtn = document.getElementById('dailyChallengeBtn');
        if (challengeBtn) challengeBtn.textContent = t.startChallenge || '开始今日挑战';
    }

    // 更新信息内容
    updateInfoContent(t) {
        console.log('updateInfoContent called with translations for language:', this.currentLanguage);
        
        // 回退到中文翻译的辅助函数
        const fallback = translations.zh;
        
        function getTranslation(key) {
            const result = t[key] || fallback[key] || key;
            if (!t[key] && fallback[key]) {
                console.log('Using fallback for key:', key);
            }
            return result;
        }
        
        // 更新信息区域标题
        const freeGameTitle = document.querySelector('.info-header h2');
        if (freeGameTitle) {
            freeGameTitle.textContent = getTranslation('freeGameTitle');
        }

        // 更新好处区域
        const benefitsSection = document.querySelector('.info-benefits');
        if (benefitsSection) {
            const title = benefitsSection.querySelector('h4');
            if (title) title.textContent = `🧠 ${getTranslation('gameBenefits')}`;
            
            const benefitItems = benefitsSection.querySelectorAll('.benefit-item');
            const benefits = [
                { key: 'logicTitle', desc: 'logicDesc' },
                { key: 'memoryTitle', desc: 'memoryDesc' },
                { key: 'focusTitle', desc: 'focusDesc' },
                { key: 'cognitiveTitle', desc: 'cognitiveDesc' },
                { key: 'stressTitle', desc: 'stressDesc' }
            ];
            
            benefitItems.forEach((item, index) => {
                if (index < benefits.length) {
                    const benefit = benefits[index];
                    item.innerHTML = `<strong>${getTranslation(benefit.key)}：</strong>${getTranslation(benefit.desc)}`;
                }
            });
        }

        // 更新规则区域
        const rulesSection = document.querySelector('.info-rules');
        if (rulesSection) {
            const title = rulesSection.querySelector('h4');
            const ruleItems = rulesSection.querySelectorAll('.rule-text');
            
            if (title) title.textContent = `🎯 ${getTranslation('gameRulesTitle')}`;
            if (ruleItems.length >= 3) {
                ruleItems[0].innerHTML = `<strong>${getTranslation('rowRuleTitle')}：</strong>${getTranslation('rowRuleDesc')}`;
                ruleItems[1].innerHTML = `<strong>${getTranslation('colRuleTitle')}：</strong>${getTranslation('colRuleDesc')}`;
                ruleItems[2].innerHTML = `<strong>${getTranslation('boxRuleTitle')}：</strong>${getTranslation('boxRuleDesc')}`;
            }
        }

        // 更新技巧区域
        this.updateTipsSection(getTranslation);

        // 更新特色区域
        this.updateFeaturesSection(getTranslation);
    }

    // 更新技巧区域
    updateTipsSection(getTranslation) {
        const tipsSection = document.querySelector('.info-tips');
        if (!tipsSection) return;

        const title = tipsSection.querySelector('h4');
        if (title) title.textContent = `💡 ${getTranslation('gameTips')}`;

        // 更新基本技巧
        const basicCategory = tipsSection.querySelector('.tip-category');
        if (basicCategory) {
            const categoryTitle = basicCategory.querySelector('h5');
            if (categoryTitle) categoryTitle.textContent = getTranslation('basicTechniques');

            const tipItems = basicCategory.querySelectorAll('.tip-item');
            const basicTips = [
                { title: 'uniqueMethodTitle', desc: 'uniqueMethodDesc' },
                { title: 'eliminationTitle', desc: 'eliminationDesc' },
                { title: 'candidateTitle', desc: 'candidateDesc' }
            ];

            tipItems.forEach((item, index) => {
                if (index < basicTips.length) {
                    const tip = basicTips[index];
                    const titleElement = item.querySelector('.tip-title');
                    const descElement = item.querySelector('.tip-desc');
                    if (titleElement) titleElement.textContent = getTranslation(tip.title);
                    if (descElement) descElement.textContent = getTranslation(tip.desc);
                }
            });
        }
    }

    // 更新特色区域
    updateFeaturesSection(getTranslation) {
        const featuresSection = document.querySelector('.info-features');
        if (!featuresSection) return;

        const title = featuresSection.querySelector('h4');
        if (title) title.textContent = `✨ ${getTranslation('gameFeatures')}`;

        const featureItems = featuresSection.querySelectorAll('.feature-item');
        const features = [
            { title: 'hintFeatureTitle', desc: 'hintFeatureDesc' },
            { title: 'pencilFeatureTitle', desc: 'pencilFeatureDesc' },
            { title: 'undoFeatureTitle', desc: 'undoFeatureDesc' },
            { title: 'dailyFeatureTitle', desc: 'dailyFeatureDesc' },
            { title: 'achievementFeatureTitle', desc: 'achievementFeatureDesc' },
            { title: 'multiLanguageTitle', desc: 'multiLanguageDesc' }
        ];

        featureItems.forEach((item, index) => {
            if (index < features.length) {
                const feature = features[index];
                const titleElement = item.querySelector('.feature-title');
                const descElement = item.querySelector('.feature-desc');
                if (titleElement) titleElement.textContent = getTranslation(feature.title);
                if (descElement) descElement.textContent = getTranslation(feature.desc);
            }
        });
    }

    // 更新页面特定内容
    updatePageSpecificContent(t) {
        // 辅助函数
        function getTranslation(key) {
            return t[key] || translations.zh[key] || key;
        }
        
        // 更新每日挑战页面
        const challengePage = document.getElementById('challengePage');
        if (challengePage) {
            const challengeDesc = challengePage.querySelector('.challenge-header p');
            if (challengeDesc) challengeDesc.textContent = getTranslation('completeTodayRewards');
            
            const startBtn = challengePage.querySelector('#challengeStartBtn');
            if (startBtn) startBtn.textContent = getTranslation('startChallenge');
        }
        
        // 更新奖杯页面
        const trophyPage = document.getElementById('trophyPage');
        if (trophyPage) {
            const masterTitle = trophyPage.querySelector('.trophy-title');
            if (masterTitle) masterTitle.textContent = `🏆 ${getTranslation('sudokuMaster')}`;
            
            const gameTimeLabel = trophyPage.querySelector('.game-time-label');
            if (gameTimeLabel) gameTimeLabel.textContent = getTranslation('totalGameTime');
            
            const puzzlesLabel = trophyPage.querySelector('.puzzles-label');
            if (puzzlesLabel) puzzlesLabel.textContent = getTranslation('completedPuzzles');
        }
        
        // 更新商店页面
        const shopPage = document.getElementById('shopPage');
        if (shopPage) {
            const balanceLabel = shopPage.querySelector('.balance-label');
            if (balanceLabel) balanceLabel.textContent = getTranslation('currentBalance');
            
            const shopDesc = shopPage.querySelector('.shop-description');
            if (shopDesc) shopDesc.textContent = getTranslation('useStarsExchange');
            
            // 更新商店项目
            const exchangeBtns = shopPage.querySelectorAll('.exchange-btn');
            exchangeBtns.forEach(btn => {
                btn.textContent = getTranslation('exchangeNow');
            });
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Sudoku UI...');
    try {
        const sudokuUI = new SudokuUI();
        
        // 定期更新计时器
        setInterval(() => {
            sudokuUI.updateTimer();
        }, 1000);
        
        console.log('Sudoku UI initialized successfully!');
    } catch (error) {
        console.error('Error initializing Sudoku UI:', error);
    }
}); 