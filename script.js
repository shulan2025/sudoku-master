// This is the complete script.js content with the professional Sudoku Generator integrated.
// Please replace your entire script.js file with this code.

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 专业数独谜题生成器
     * 基于回溯算法生成完整数独，并通过验证唯一解来挖空。
     */
    const SudokuGenerator = (function() {

        // --- 内部辅助函数 ---

        /**
         * 检查数字在给定行、列、3x3宫格中是否合法。
         * @param {Array<Array<number>>} board - 当前数独盘面。
         * @param {number} row - 行索引。
         * @param {number} col - 列索引。
         * @param {number} num - 要检查的数字。
         * @returns {boolean} - 如果合法返回 true，否则返回 false。
         */
        function isValid(board, row, col, num) {
            // 检查行和列
            for (let x = 0; x < 9; x++) {
                if (board[row][x] === num || board[x][col] === num) return false;
            }

            // 检查3x3宫格
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i + startRow][j + startCol] === num) return false;
                }
            }
            return true;
        }

        /**
         * 寻找盘面上下一个未填充的单元格。
         * @param {Array<Array<number>>} board - 当前数独盘面。
         * @returns {Array<number>|null} - 返回 [row, col] 数组，如果所有单元格都已填充则返回 null。
         */
        function findEmpty(board) {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (board[r][c] === 0) return [r, c];
                }
            }
            return null;
        }

        /**
         * 使用回溯算法求解数独。
         * @param {Array<Array<number>>} board - 当前数独盘面。
         * @param {number} [limitSolutions] - 限制找到的解决方案数量，用于唯一解验证。
         * @param {Array<Array<Array<number>>>} [solutions] - 存储找到的解决方案。
         * @returns {boolean} - 如果找到解决方案返回 true，否则返回 false。
         */
        function solveSudoku(board, limitSolutions = 1, solutions = []) {
            const emptyPos = findEmpty(board);
            if (!emptyPos) {
                // 找到一个解
                solutions.push(JSON.parse(JSON.stringify(board))); // 深拷贝解
                return true;
            }

            if (solutions.length >= limitSolutions) { // 如果已达到解决方案数量限制
                return true;
            }

            const [row, col] = emptyPos;
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            // 随机化尝试的数字顺序，使得生成完整谜题时更随机
            for (let i = numbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }

            for (const num of numbers) {
                if (isValid(board, row, col, num)) {
                    board[row][col] = num;

                    // 递归调用
                    if (solveSudoku(board, limitSolutions, solutions)) {
                        if (solutions.length >= limitSolutions) {
                            return true; // 如果已经找到足够多的解，立即返回
                        }
                    }
                    
                    board[row][col] = 0; // 回溯
                }
            }
            return false; // 无法找到解
        }

        /**
         * 验证数独是否有唯一解。
         * @param {Array<Array<number>>} board - 数独谜题盘面。
         * @returns {boolean} - 如果有且仅有一个解返回 true，否则返回 false。
         */
        function hasUniqueSolution(board) {
            const tempBoard = JSON.parse(JSON.stringify(board)); // 工作副本
            const solutions = [];
            solveSudoku(tempBoard, 2, solutions); // 尝试找到最多2个解
            return solutions.length === 1; // 只有1个解才是唯一的
        }

        // --- 外部接口 ---

        return {
            /**
             * 生成一个完整的、已解决的随机数独网格。
             * @returns {Array<Array<number>>} - 完整的 9x9 数独网格。
             */
            generateFullSudoku: function() {
                const board = Array(9).fill(0).map(() => Array(9).fill(0));
                // 预填充对角线的3个3x3宫格，提高随机性与效率
                const fillBox = (startRow, startCol) => {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    let k = 0;
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            board[i + startRow][j + startCol] = numbers[k++];
                        }
                    }
                };
                fillBox(0, 0);
                fillBox(3, 3);
                fillBox(6, 6);

                solveSudoku(board); // 填充剩余部分
                return board;
            },

            /**
             * 从一个完整的数独网格生成一个谜题。
             * @param {Array<Array<number>>} fullSudoku - 完整的、已解决的数独网格。
             * @param {number} numClues - 谜题中保留的提示数字数量 (挖空后剩余的数字)。
             * @returns {Array<Array<number>>} - 生成的数独谜题。
             */
            generatePuzzle: function(fullSudoku, numClues) {
                let puzzle = JSON.parse(JSON.stringify(fullSudoku)); // 复制完整数独
                let currentClues = 81; // 初始81个线索
                const positions = Array.from({length: 81}, (_, i) => [Math.floor(i / 9), i % 9]);
                
                // 随机打乱位置，以便随机移除
                for (let i = positions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [positions[i], positions[j]] = [positions[j], positions[i]];
                }

                let attemptsPerPosition = new Map(); // 记录每个位置的尝试次数
                const maxAttemptsPerPosition = 2; // 避免在某个位置上尝试无限次

                while (currentClues > numClues && positions.length > 0) {
                    const [r, c] = positions.shift(); // 每次从队列头部取出一个位置
                    const originalValue = puzzle[r][c];
                    
                    puzzle[r][c] = 0; // 尝试移除
                    currentClues--;

                    // 检查移除后是否仍有唯一解
                    if (!hasUniqueSolution(puzzle)) {
                        puzzle[r][c] = originalValue; // 如果没有唯一解，恢复数字
                        currentClues++;
                        
                        // 如果无法移除，将该位置放回队列尾部，但限制尝试次数
                        const key = `${r}-${c}`;
                        attemptsPerPosition.set(key, (attemptsPerPosition.get(key) || 0) + 1);
                        if (attemptsPerPosition.get(key) < maxAttemptsPerPosition) {
                            positions.push([r,c]); // 没能成功移除，放回队列尾部
                        }
                    } else {
                        attemptsPerPosition.delete(`${r}-${c}`); // 成功移除，清除尝试计数
                    }
                    
                    // 确保谜题密度不会太低，即使不满足numClues也停止
                    if (currentClues <= 17 && numClues <= 17) { // 约17个数字是最低合法数独的线索数
                        break;
                    }
                }
                return puzzle;
            },

            /**
             * 根据难度生成一个完整的数独谜题。
             * @param {string} difficulty - 难度级别 ('easy', 'medium', 'hard', 'expert', 'master', 'extreme').
             * @returns {Array<Array<number>>} - 生成的数独谜题。
             */
            getSudokuByDifficulty: function(difficulty) {
                // 定义不同难度对应的保留线索数量 (这个值需要根据实际效果调整)
                const cluesMap = {
                    easy: 50,    // 50个数字提示
                    medium: 40,  // 40个数字提示
                    hard: 30,    // 30个数字提示
                    expert: 25,  // 25个数字提示
                    master: 22,  // 22个数字提示
                    extreme: 17  // 17个数字提示 (通常是最低的，最难)
                };

                const numClues = cluesMap[difficulty] || cluesMap.easy; // 默认为简单难度

                let fullSudoku = null;
                let puzzle = null;
                let attempts = 0;
                const maxGenerationAttempts = 5; // 尝试生成完整谜题并挖空的次数，防止陷入死循环

                // 尝试多次生成，直到生成一个符合要求的谜题
                while (attempts < maxGenerationAttempts) {
                    fullSudoku = this.generateFullSudoku(); // 生成一个完整的数独
                    puzzle = this.generatePuzzle(fullSudoku, numClues); // 从完整数独中挖空
                    
                    // 检查生成的谜题是否符合要求（例如，是否达到了预期的线索数量）
                    let clueCount = 0;
                    for (let r = 0; r < 9; r++) {
                        for (let c = 0; c < 9; c++) {
                            if (puzzle[r][c] !== 0) clueCount++;
                        }
                    }
                    
                    // 如果线索数量在预期范围内，则认为生成成功
                    if (clueCount >= numClues - 5 && clueCount <= numClues + 5) { // 允许少量误差
                        return puzzle;
                    }
                    attempts++;
                }
                
                // 如果尝试多次仍无法生成，退回到一个已知的、非空的简单谜题
                console.warn(`Failed to generate a ${difficulty} puzzle after ${maxGenerationAttempts} attempts. Falling back to easy puzzle.`);
                // 这里不再递归调用自身，因为可能再次失败。直接提供一个可靠的备用谜题。
                const reliableEasyPuzzle = [ // 确保这个是可靠的，有唯一解的简单谜题
                    [5,3,0,0,7,0,0,0,0],
                    [6,0,0,1,9,5,0,0,0],
                    [0,9,8,0,0,0,0,6,0],
                    [8,0,0,0,6,0,0,0,3],
                    [4,0,0,8,0,3,0,0,1],
                    [7,0,0,0,2,0,0,0,6],
                    [0,6,0,0,0,0,2,8,0],
                    [0,0,0,4,1,9,0,0,5],
                    [0,0,0,0,8,0,0,7,9]
                ];
                return reliableEasyPuzzle;
            }
        };
    })(); // SudokuGenerator 立即执行函数结束


    // --- DOM 元素引用 ---
    const sudokuContainer = document.getElementById('sudoku-container');

    // 导航栏元素
    const difficultyDropdownBtn = document.getElementById('difficulty-dropdown-btn');
    const difficultyDropdownMenu = document.getElementById('difficulty-dropdown-menu');
    const difficultyButtonsInMenu = difficultyDropdownMenu.querySelectorAll('button');
    const langDropdownBtn = document.getElementById('lang-dropdown-btn');
    const langDropdownMenu = document.getElementById('lang-dropdown-menu');
    const langButtonsInMenu = langDropdownMenu.querySelectorAll('button');
    const themeToggleButton = document.getElementById('theme-toggle-btn');

    // 右侧面板元素
    const errorCountDisplay = document.getElementById('error-count');
    const timerDisplay = document.getElementById('timer'); // 实际显示时间的span
    const pauseBtn = document.getElementById('pause-btn'); // 计时器旁的暂停按钮
    const undoBtn = document.getElementById('undo-btn'); // 撤销按钮
    const noteModeBtn = document.getElementById('note-mode-btn'); // 笔记模式按钮
    const eraseBtn = document.getElementById('erase-btn'); // 橡皮擦按钮 (旧的clear功能)
    const hintBtn = document.getElementById('hint-btn'); // 提示按钮
    const numInputButtons = document.querySelectorAll('#number-input-panel .num-btn');
    const newGameBottomBtn = document.getElementById('new-game-btn'); // 底部的新游戏按钮

    const messageDisplay = document.getElementById('message'); // 独立的消息区

    // --- 游戏状态变量 ---
    let selectedCell = null;
    let currentSudoku = []; // 游戏盘面当前数字
    let initialSudoku = []; // 游戏盘面初始数字
    let timerInterval;
    let seconds = 0;
    let currentDifficulty = 'easy'; // 默认难度
    let currentLanguage = 'en'; // 默认语言
    let isDarkMode = false; // 默认浅色模式
    let errorCount = 0; // 错误计数
    const maxErrors = 3; // 最大允许错误数
    let isPaused = false; // 游戏是否暂停
    let isNoteMode = false; // 是否为笔记模式

    // --- Undo/Redo 栈 ---
    let historyStack = [];
    let historyPointer = -1; // 指向当前状态

    // --- 多语言支持的文本数据 ---
    const translations = {
        en: {
            pageTitle: "Play Sudoku Online Free - Master Logic, Boost Brain & Memory!",
            pageDescription: "Enjoy thousands of free online Sudoku puzzles daily! Perfect for beginners and masters, our games enhance your logical thinking, improve memory, and provide a full brain workout. No download needed. Start your challenge now!",
            pageKeywords: "sudoku, sudoku online, free sudoku, play sudoku, sudoku puzzles, logic game, brain game, memory game, daily sudoku, classic sudoku, sudoku master",
            gameTitle: "Sudoku Master",
            currentDifficultyText: "Easy",
            difficultyEasy: "Easy",
            difficultyMedium: "Medium",
            difficultyHard: "Hard",
            difficultyExpert: "Expert",
            difficultyMaster: "Master",
            difficultyExtreme: "Extreme",
            timeDisplayOnly: "00:00",
            errorCount: "Error {current}/{max}",
            newGame: "New Game",
            hintComingSoon: "Hint feature coming soon...",
            resetConfirm: "Are you sure you want to reset the current puzzle? This will clear all your entries.",
            winMessage: "Congratulations! You solved the Sudoku in",
            
            // HTML 内容段落的 data-lang-key
            howToPlayTitle: "How to Play Sudoku - Your Ultimate Beginner's Guide to Sudoku Master",
            howToPlayIntro: "Welcome to Sudoku Master! Ready to embark on your journey to becoming a true Sudoku pro? Our website offers an intuitive and <strong>free online Sudoku experience</strong>, perfect for anyone looking to <strong>boost logic</strong>, <strong>enhance memory</strong>, and <strong>sharpen focus</strong>. Let's dive into how you can start enjoying this classic brain game today!",
            gettingStartedTitle: "Getting Started is Easy! Choose Your Challenge:",
            gettingStartedText: "Upon loading the Sudoku Master homepage, you'll immediately see our diverse range of difficulty levels, designed to cater to every player, from complete beginners to aspiring Sudoku masters:",
            difficultyEasyDesc: "<strong>Easy:</strong> Ideal for Sudoku newcomers or those seeking a relaxing mental break. Plenty of starting numbers provide a gentle introduction, helping you quickly learn Sudoku rules and build confidence. It's the perfect entry point for your daily puzzle fix!",
            difficultyMediumDesc: "<strong>Medium:</strong> A balanced challenge for players with some Sudoku experience. Fewer initial numbers require more strategic thinking, offering a rewarding blend of fun and mental exercise.",
            difficultyHardDesc: "<strong>Hard:</strong> Ready to deepen your Sudoku skills? This level features a significantly emptier grid, demanding more focused logical reasoning and advanced Sudoku strategies. It's your next step towards puzzle mastery.",
            difficultyExpertDesc: "<strong>Expert:</strong> Designed for seasoned solvers who crave a real brain workout. With minimal starting clues, this level is a true test of your deduction and problem-solving abilities.",
            difficultyMasterDesc: "<strong>Master:</strong> Reserved for those who truly excel at number puzzles. This difficulty pushes the boundaries of conventional Sudoku techniques, offering an intense and highly rewarding experience for dedicated logic game enthusiasts.",
            difficultyExtremeDesc: "<strong>Extreme:</strong> Our ultimate challenge. This level presents the fewest starting numbers, a daunting 'mountain' for only the most astute Sudoku experts to conquer. If you've effortlessly mastered the Expert level and seek the peak of mental agility, this is for you!",
            difficultySelectionTip: "Simply use the intuitive dropdown menu at the top of the page to select your preferred difficulty. Every <strong>Sudoku puzzle</strong> on our site is randomly generated, ensuring you'll never play the same board twice! This guarantees endless <strong>Sudoku fun</strong> and a truly unique <strong>brain-training session</strong> every time.",
            navigatingGameTitle: "Navigating the Game: Simple & Smart Controls",
            navigatingGameText1: "Before each game begins, you'll see a quick set of instructions to guide you through your Sudoku Master adventure. You'll quickly get the hang of it:",
            navigatingGameText2: "<strong>Select & Fill:</strong> Tap any empty cell on the <strong>Sudoku grid</strong> to select it. Then, use the clear number input panel on the right side of the game board (or your keyboard's number keys) to place a digit from 1 to 9. It's that straightforward to <strong>solve Sudoku online</strong>!",
            navigatingGameText3: "<strong>Highlighting Helper:</strong> Select any pre-filled or correctly placed number on the board, and our smart system will instantly highlight all identical numbers across the grid. This visual aid is incredibly helpful for tracking number distribution and planning your next move, significantly aiding your <strong>Sudoku solving techniques</strong>.",
            navigatingGameText4: "<strong>Use \"Note Mode\":</strong> Tap the pencil icon (<i class='fas fa-pencil-alt'></i>) to switch into \"Note Mode.\" This powerful feature allows you to jot down small pencil marks (candidate numbers) within a cell without committing to a final answer. It’s an essential <strong>Sudoku strategy tool</strong> for verifying your guesses and making complex deductions, especially in <strong>hard Sudoku puzzles</strong>.",
            navigatingGameText5: "<strong>Effortless Erase:</strong> Need to correct a number or clear your notes? Simply re-select the cell and tap the eraser icon (<i class='fas fa-eraser'></i>) or press the \"0\" key on your keyboard.",
            navigatingGameText6: "These helpful instructions will appear at the start of every new game. If you prefer to jump straight in, you can easily disable them in the settings menu (look for the gear icon <i class='fas fa-cog'></i> - currently not implemented). In settings, you can also customize other options like \"Board Animations\" or \"Allow Errors\" (these features are not yet implemented in code).",
            errorSystemTitle: "Our Smart Error System: Learn & Improve Without Frustration",
            errorSystemText1: "For newcomers, we highly recommend keeping the \"Allow Errors\" feature enabled. This means you can freely place numbers without immediate penalty, allowing you to <strong>learn by doing</strong> and explore possibilities. When you're ready for an extra challenge, disable this feature – every incorrect entry will then add 15 seconds to your timer (this feature is not yet implemented), making it a great way to <strong>improve focus and accuracy</strong> as you progress towards mastering Sudoku.",
            errorSystemText2: "Even with \"Allow Errors\" enabled, Sudoku Master will instantly highlight any rule violations. If you place a number that creates a duplicate in any row, column, or 3x3 block, the problematic cells will be immediately marked in vibrant red – as shown below:",
            errorSystemText3: "In this example, you can see two '2's highlighted in red in the bottom-left 3x3 block, as well as in their respective row and column. This instant feedback prevents you from getting deep into a challenging Sudoku only to discover a hidden mistake much later. Errors are flagged immediately, allowing for quick correction and a smoother, more enjoyable <strong>Sudoku solving experience</strong>.",
            callToAction: "Ready to <strong>play free Sudoku online</strong> and give your brain the ultimate <strong>mental workout</strong>? Start your challenge now on <strong>Sudoku Master</strong> – where infinite <strong>logic puzzles</strong> await!",
            rulesTitle: "Sudoku Game Rules - Basic Principles for All Levels",
            rulesContent: "Sudoku is a logic-based, combinatorial number-placement puzzle. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids that compose the grid (also called \"boxes\", \"blocks\", or \"regions\") contains all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single solution. This classic brain game challenges your logical thinking and improves your memory.",
            strategyTitle: "Sudoku Strategies & Tips - Master Your Logic Skills",
            strategyContent1: "1. <strong>Observation (Scanning):</strong> Start by scanning rows, columns, and 3x3 blocks for missing numbers. Look for where a number can only fit in one specific cell.",
            strategyContent2: "2. <strong>Elimination (Cross-hatching):</strong> Use existing numbers to eliminate possibilities for other cells. If a number is present in a row, column, or block, it cannot be in other cells within that same row, column, or block.",
            strategyContent3: "3. <strong>Naked/Hidden Singles:</strong> Identify cells that have only one possible value (Naked Single), or numbers that can only go in one specific cell within a row/column/block (Hidden Single).",
            strategyContent4: "4. <strong>Pair/Triple Strategies:</strong> Look for pairs or triples of numbers that are limited to a specific set of cells within a row, column, or block, allowing you to eliminate them from other cells.",
            strategyEnding: "By practicing these Sudoku solving techniques, you can significantly improve your logical thinking and problem-solving abilities. Play daily for a full brain workout!",
            footerText: "&copy; 2025 Sudoku Master. All rights reserved. Play free online Sudoku puzzles daily!",

            // 新增的按钮 title 属性的翻译
            pauseGameTitle: "Pause Game",
            changeLanguageTitle: "Change Language",
            toggleThemeTitle: "Toggle Dark/Light Mode",
            undoTitle: "Undo",
            noteModeTitle: "Note Mode",
            eraseTitle: "Erase",
            hintTitle: "Hint",
            
            // 消息提示的翻译
            noPuzzleData: "No {difficulty} puzzle data. Starting with Easy.",
            difficultySelected: "Selected difficulty: {difficulty}. Click \"New Game\" to start a new puzzle.", // This message will be removed for auto-start
            clearInputPanel: "Clear", // This key seems unused in JS logic directly, but good to have
            gameOver: "Game Over! Too many errors.",
            undoNotAvailable: "No more moves to undo.",
            noteModeOn: "Note Mode ON",
            noteModeOff: "Note Mode OFF",
            gamePaused: "Game Paused",
            gameResumed: "Game Resumed",
            clearMainNumberFirst: "Clear main number first to add notes.",
            hintProvided: "Hint provided!",
            noEmptyCellsForHint: "No empty cells for hint or all cells correctly filled.",
            videoSectionTitle: "Sudoku Video Tutorials & Solutions", // These keys are in data but not in HTML
            videoSectionIntro: "Watch our step-by-step video guides to learn Sudoku, master advanced strategies, and see how expert puzzles are solved. Elevate your game and become a true Sudoku master!", // These keys are in data but not in HTML
            videoTitle1: "Sudoku for Beginners: Rules & First Steps", // These keys are in data but not in HTML
            videoDesc1: "Learn the basic rules of Sudoku and how to make your first moves. Perfect for absolute beginners!", // These keys are in data but not in HTML
            videoTitle2: "Advanced Sudoku Strategy: Naked & Hidden Singles", // These keys are in data but not in HTML
            videoDesc2: "Dive deeper into Sudoku solving with powerful techniques like Naked Singles and Hidden Singles.", // These keys are in data but not in HTML
            videoTitle3: "Solving an Expert Sudoku - Step by Step Guide", // These keys are in data but not in HTML
            videoDesc3: "Watch an expert solve a challenging Sudoku puzzle and learn their thought process." // These keys are in data but not in HTML
        },
        de: { 
            pageTitle: "Kostenloses Online-Sudoku - Meistere Logik, steigere Gehirnleistung & Gedächtnis!",
            pageDescription: "Genießen Sie täglich Tausende kostenloser Online-Sudoku-Rätsel! Perfekt für Anfänger und Meister, unsere Spiele verbessern Ihr logisches Denken, fördern das Gedächtnis und bieten ein umfassendes Gehirntraining. Kein Download erforderlich. Starten Sie jetzt Ihre Herausforderung!",
            pageKeywords: "sudoku, online sudoku, kostenloses sudoku, sudoku spielen, sudoku rätsel, logikspiel, denkspiel, gedächtnisspiel, tägliches sudoku, klassisches sudoku, sudoku meister",
            gameTitle: "Sudoku Meister",
            currentDifficultyText: "Einfach",
            difficultyEasy: "Einfach",
            difficultyMedium: "Mittel",
            difficultyHard: "Schwer",
            difficultyExpert: "Experte",
            difficultyMaster: "Meister",
            difficultyExtreme: "Extrem",
            timeDisplayOnly: "00:00",
            errorCount: "Fehler {current}/{max}",
            newGame: "Neues Spiel",
            hintComingSoon: "Hinweis-Funktion demnächst verfügbar...",
            resetConfirm: "Möchten Sie das aktuelle Rätsel wirklich zurücksetzen? Dadurch werden alle Ihre Eingaben gelöscht.",
            winMessage: "Herzlichen Glückwunsch! Sie haben das Sudoku gelöst in",

            howToPlayTitle: "Wie man Sudoku spielt - Eine Schritt-für-Schritt-Anleitung für Anfänger",
            howToPlayIntro: "Willkommen bei Sudoku Meister! Bereit, Ihre Reise zu einem wahren Sudoku-Profi zu beginnen? Unsere Website bietet ein intuitives und <strong>kostenloses Online-Sudoku-Erlebnis</strong>, perfekt für alle, die ihre <strong>Logik steigern</strong>, ihr <strong>Gedächtnis verbessern</strong> und ihre <strong>Konzentration schärfen</strong> möchten. Lassen Sie uns eintauchen, wie Sie dieses klassische Denkspiel noch heute genießen können!",
            gettingStartedTitle: "Erste Schritte leicht gemacht! Wählen Sie Ihre Herausforderung:",
            gettingStartedText: "Nach dem Laden der Sudoku Meister-Homepage sehen Sie sofort unsere vielfältigen Schwierigkeitsgrade, die für jeden Spieler geeignet sind, vom absoluten Anfänger bis zum angehenden Sudoku-Meister:",
            difficultyEasyDesc: "<strong>Einfach:</strong> Ideal für Sudoku-Neulinge oder diejenigen, die eine entspannende mentale Pause suchen. Viele Startzahlen bieten eine sanfte Einführung, die Ihnen hilft, die Sudoku-Regeln schnell zu lernen und Selbstvertrauen aufzubauen. Es ist der perfekte Einstieg für Ihre tägliche Rätsel-Dosis!",
            difficultyMediumDesc: "<strong>Mittel:</strong> Eine ausgewogene Herausforderung für Spieler mit etwas Sudoku-Erfahrung. Weniger Startzahlen erfordern strategischeres Denken und bieten eine lohnende Mischung aus Spaß und mentaler Übung.",
            difficultyHardDesc: "<strong>Schwer:</strong> Bereit, Ihre Sudoku-Fähigkeiten zu vertiefen? Dieser Schwierigkeitsgrad bietet ein deutlich leereres Gitter, das mehr konzentriertes logisches Denken und fortgeschrittene Sudoku-Strategien erfordert. Es ist Ihr nächster Schritt zur Rätselbeherrschung.",
            difficultyExpertDesc: "<strong>Experte:</strong> Für erfahrene Löser konzipiert, die ein echtes Gehirntraining suchen. Mit minimalen Start-Hinweisen ist dieser Schwierigkeitsgrad ein echter Test Ihrer Deduktions- und Problemlösungsfähigkeiten.",
            difficultyMasterDesc: "<strong>Meister:</strong> Reserviert für diejenigen, die Zahlenrätsel wirklich beherrschen. Dieser Schwierigkeitsgrad verschiebt die Grenzen der konventionellen Sudoku-Techniken und bietet ein intensives und äußerst lohnendes Erlebnis für engagierte Logikspiel-Enthusiasten.",
            difficultyExtremeDesc: "<strong>Extrem:</strong> Unsere ultimative Herausforderung. Dieser Schwierigkeitsgrad präsentiert die wenigsten Startzahlen, einen gewaltigen \"Berg\" nur für die scharfsinnigsten Sudoku-Experten zu erobern. Wenn Sie den Experten-Level mühelos gemeistert haben und den Höhepunkt der mentalen Beweglichkeit suchen, ist dies das Richtige für Sie!",
            difficultySelectionTip: "Verwenden Sie einfach das intuitive Dropdown-Menü oben auf der Seite, um Ihren bevorzugten Schwierigkeitsgrad auszuwählen. Jedes <strong>Sudoku-Rätsel</strong> auf unserer Website wird zufällig generiert, sodass Sie niemals dasselbe Spielfeld zweimal spielen werden! Dies garantiert endlosen <strong>Sudoku-Spaß</strong> und eine wirklich einzigartige <strong>Gehirntrainingseinheit</strong> jedes Mal.",
            navigatingGameTitle: "Das Spiel navigieren: Einfache & intelligente Steuerung",
            navigatingGameText1: "Bevor jedes Spiel beginnt, sehen Sie eine kurze Anleitung, die Sie durch Ihr Sudoku-Meister-Abenteuer führt. Sie werden es schnell beherrschen:",
            navigatingGameText2: "<strong>Auswählen & Füllen:</strong> Tippen Sie auf eine leere Zelle im <strong>Sudoku-Gitter</strong>, um sie auszuwählen. Verwenden Sie dann das klare Zifferneingabefeld auf der rechten Seite des Spielbretts (oder die Zifferntasten Ihrer Tastatur), um eine Ziffer von 1 bis 9 zu platzieren. So einfach ist es, <strong>Sudoku online zu lösen</strong>!",
            navigatingGameText3: "<strong>Hervorhebungshelfer:</strong> Wählen Sie eine vorgefüllte oder korrekt platzierte Zahl auf dem Brett aus, und unser intelligentes System hebt sofort alle identischen Zahlen im gesamten Gitter hervor. Diese visuelle Hilfe ist unglaublich nützlich, um die Zahlenverteilung zu verfolgen und Ihren nächsten Zug zu planen, was Ihre <strong>Sudoku-Lösungstechniken</strong> erheblich unterstützt.",
            navigatingGameText4: "<strong>Notizmodus verwenden:</strong> Tippen Sie auf das Bleistiftsymbol (<i class='fas fa-pencil-alt'></i>), um in den \"Notizmodus\" zu wechseln. Diese leistungsstarke Funktion ermöglicht es Ihnen, kleine Bleistiftmarkierungen (Kandidatenzahlen) in einer Zelle zu notieren, ohne sich auf eine endgültige Antwort festzulegen. Es ist ein wesentliches <strong>Sudoku-Strategie-Werkzeug</strong>, um Ihre Vermutungen zu überprüfen und komplexe Ableitungen zu treffen, insbesondere bei <strong>schwierigen Sudoku-Rätseln</strong>.",
            navigatingGameText5: "<strong>Müheloses Löschen:</strong> Müssen Sie eine Zahl korrigieren oder Ihre Notizen löschen? Wählen Sie einfach die Zelle erneut aus und tippen Sie auf das Radiergummi-Symbol (<i class='fas fa-eraser'></i>) oder drücken Sie die Taste \"0\" auf Ihrer Tastatur.",
            navigatingGameText6: "Diese hilfreichen Anweisungen werden zu Beginn jedes neuen Spiels angezeigt. Wenn Sie lieber direkt einsteigen möchten, können Sie sie einfach im Einstellungsmenü deaktivieren (suchen Sie nach dem Zahnradsymbol <i class='fas fa-cog'></i> – derzeit nicht implementiert). In den Einstellungen können Sie auch andere Optionen wie \"Brettanimationen\" oder \"Fehler zulassen\" anpassen (diese Funktionen sind noch nicht im Code implementiert).",
            errorSystemTitle: "Unser intelligentes Fehlersystem: Lernen und verbessern ohne Frustration",
            errorSystemText1: "Für Neulinge empfehlen wir dringend, die Funktion \"Fehler zulassen\" aktiviert zu lassen. Das bedeutet, dass Sie Zahlen frei platzieren können, ohne sofort bestraft zu werden, was Ihnen ermöglicht, <strong>durch Ausprobieren zu lernen</strong> und Möglichkeiten zu erkunden. Wenn Sie bereit für eine zusätzliche Herausforderung sind, deaktivieren Sie diese Funktion – jeder falsche Eintrag verlängert dann Ihren Timer um 15 Sekunden (diese Funktion ist noch nicht implementiert), was eine großartige Möglichkeit ist, <strong>Konzentration und Genauigkeit zu verbessern</strong>, während Sie Sudoku meistern.",
            errorSystemText2: "Selbst wenn \"Fehler zulassen\" aktiviert ist, hebt Sudoku Meister sofort alle Regelverletzungen hervor. Wenn Sie eine Zahl platzieren, die eine Dublette in einer Reihe, Spalte oder einem 3x3-Block erzeugt, werden die problematischen Zellen sofort in leuchtendem Rot markiert – wie unten gezeigt:",
            errorSystemText3: "In diesem Beispiel sehen Sie zwei '2'en in Rot im unteren linken 3x3-Block sowie in ihrer jeweiligen Reihe und Spalte hervorgehoben. Dieses sofortige Feedback verhindert, dass Sie tief in ein herausforderndes Sudoku eintauchen, nur um einen versteckten Fehler viel später zu entdecken. Fehler werden sofort markiert, was eine schnelle Korrektur und ein reibungsloseres, angenehmeres <strong>Sudoku-Lösungserlebnis</strong> ermöglicht.",
            callToAction: "Bereit, <strong>kostenlos Sudoku online zu spielen</strong> und Ihrem Gehirn das ultimative <strong>Mentaltraining</strong> zu geben? Starten Sie jetzt Ihre Herausforderung auf <strong>Sudoku Meister</strong> – wo unendlich viele <strong>Logikrätsel</strong> auf Sie warten!",
            rulesTitle: "Sudoku-Spielregeln - Grundprinzipien für alle Level",
            rulesContent: "Sudoku ist ein logikbasiertes, kombinatorisches Zahlenplatzierungsrätsel. Ziel ist es, ein 9×9-Gitter mit Ziffern so zu füllen, dass jede Spalte, jede Zeile und jedes der neun 3×3-Untergitter, die das Gitter bilden (auch \"Boxen\", \"Blöcke\" oder \"Regionen\" genannt), alle Ziffern von 1 bis 9 enthält. Der Rätselsteller stellt ein teilweise ausgefülltes Gitter zur Verfügung, das für ein gut gestelltes Rätsel eine einzige Lösung hat. Dieses klassische Denkspiel fordert Ihr logisches Denken heraus und verbessert Ihr Gedächtnis.",
            strategyTitle: "Sudoku-Strategien & Tipps - Meistern Sie Ihre Logikfähigkeiten",
            strategyContent1: "1. <strong>Beobachtung (Scannen):</strong> Beginnen Sie damit, Zeilen, Spalten und 3x3-Blöcke nach fehlenden Zahlen zu durchsuchen. Suchen Sie nach Stellen, an denen eine Zahl nur in eine bestimmte Zelle passt.",
            strategyContent2: "2. <strong>Eliminierung (Kreuzschraffur):</strong> Verwenden Sie vorhandene Zahlen, um Möglichkeiten für andere Zellen auszuschließen. Wenn eine Zahl in einer Reihe, Spalte oder einem Block vorhanden ist, kann sie sich nicht in anderen Zellen derselben Reihe, Spalte oder desselben Blocks befinden.",
            strategyContent3: "3. <strong>Nackte/Versteckte Singles:</strong> Identifizieren Sie Zellen oder Zahlen, die nur einen möglichen Wert (Nackter Single) oder nur eine mögliche Position in einem bestimmten Bereich (Versteckter Single) haben.",
            strategyContent4: "4. <strong>Paar-/Tripel-Strategien:</strong> Suchen Sie nach Paaren oder Tripeln von Zahlen, die auf einen bestimmten Satz von Zellen innerhalb einer Reihe, Spalte oder eines Blocks beschränkt sind, wodurch Sie diese aus anderen Zellen eliminieren können.",
            strategyEnding: "Durch das Üben dieser Sudoku-Lösungstechniken können Sie Ihr logisches Denken und Ihre Problemlösungsfähigkeiten erheblich verbessern. Spielen Sie täglich für ein umfassendes Gehirntraining!",
            footerText: "&copy; 2025 Sudoku Meister. Alle Rechte vorbehalten. Spielen Sie täglich kostenlose Online-Sudoku-Rätsel!",

            pauseGameTitle: "Spiel pausieren",
            changeLanguageTitle: "Sprache ändern",
            toggleThemeTitle: "Dunkel-/Hellmodus umschalten",
            undoTitle: "Rückgängig",
            noteModeTitle: "Notizmodus",
            eraseTitle: "Löschen",
            hintTitle: "Hinweis",

            noPuzzleData: "Keine Rätseldaten für {difficulty}. Starte mit Einfach.",
            difficultySelected: "Gewählter Schwierigkeitsgrad: {difficulty}. Klicken Sie auf \"Neues Spiel\", um ein neues Rätsel zu starten.",
            clearInputPanel: "Löschen",
            gameOver: "Spiel vorbei! Zu viele Fehler.",
            undoNotAvailable: "Keine weiteren Züge zum Rückgängigmachen.",
            noteModeOn: "Notizmodus AN",
            noteModeOff: "Notizmodus AUS",
            gamePaused: "Spiel pausiert",
            gameResumed: "Spiel fortgesetzt",
            clearMainNumberFirst: "Löschen Sie zuerst die Hauptnummer, um Notizen hinzuzufügen.",
            hintProvided: "Hinweis gegeben!",
            noEmptyCellsForHint: "Keine leeren Zellen für Hinweis oder alle Zellen korrekt gefüllt.",
            videoSectionTitle: "Sudoku Video-Tutorials & Lösungen",
            videoSectionIntro: "Sehen Sie sich unsere Schritt-für-Schritt-Videoanleitungen an, um Sudoku zu lernen, fortgeschrittene Strategien zu meistern und zu sehen, wie Expertenrätsel gelöst werden. Steigern Sie Ihr Spiel und werden Sie ein wahrer Sudoku-Meister!",
            videoTitle1: "Sudoku für Anfänger: Regeln & Erste Schritte",
            videoDesc1: "Lernen Sie die Grundregeln von Sudoku und wie Sie Ihre ersten Züge machen. Perfekt für absolute Anfänger!",
            videoTitle2: "Fortgeschrittene Sudoku-Strategie: Nackte & Versteckte Singles",
            videoDesc2: "Tauchen Sie tiefer in die Sudoku-Lösung ein mit leistungsstarken Techniken wie Nackten Singles und Versteckten Singles.",
            videoTitle3: "Ein Experten-Sudoku lösen - Schritt-für-Schritt-Anleitung",
            videoDesc3: "Beobachten Sie, wie ein Experte ein anspruchsvolles Sudoku-Rätsel löst und lernen Sie seinen Denkprozess kennen."
        },
        ru: { 
            pageTitle: "Бесплатное онлайн-Судоку - Развивайте логику, память и мозг!",
            pageDescription: "Наслаждайтесь тысячами бесплатных онлайн-головоломок Судоку каждый день! Идеально подходит для начинающих и мастеров, наши игры развивают ваше логическое мышление, улучшают память и обеспечивают полноценную тренировку мозга. Загрузка не требуется. Начните свое испытание прямо сейчас!",
            pageKeywords: "судоку, онлайн судоку, бесплатное судоку, играть в судоку, головоломки судоку, логическая игра, игра для мозга, игра на память, ежедневное судоку, классическое судоку, мастер судоку",
            gameTitle: "Мастер Судоку",
            currentDifficultyText: "Легко",
            difficultyEasy: "Легко",
            difficultyMedium: "Средне",
            difficultyHard: "Сложно",
            difficultyExpert: "Эксперт",
            difficultyMaster: "Мастер",
            difficultyExtreme: "Экстремально",
            timeDisplayOnly: "00:00",
            errorCount: "Ошибка {current}/{max}",
            newGame: "Новая игра",
            hintComingSoon: "Функция подсказки скоро появится...",
            resetConfirm: "Вы уверены, что хотите сбросить текущую головоломку? Это очистит все ваши записи.",
            winMessage: "Поздравляем! Вы решили Судоку за",

            howToPlayTitle: "Как играть в Судоку - Пошаговое руководство для начинающих",
            howToPlayIntro: "Добро пожаловать в Мастер Судоку! Готовы отправиться в путешествие, чтобы стать настоящим профессионалом Судоку? Наш веб-сайт предлагает интуитивно понятный и <strong>бесплатный онлайн-опыт Судоку</strong>, идеально подходящий для тех, кто хочет <strong>развить логику</strong>, <strong>улучшить память</strong> и <strong>обострить внимание</strong>. Давайте узнаем, как вы можете начать наслаждаться этой классической игрой для мозга уже сегодня!",
            gettingStartedTitle: "Начать легко! Выберите свой уровень сложности:",
            gettingStartedText: "При загрузке главной страницы Мастер Судоку вы сразу увидите наш разнообразный выбор уровней сложности, разработанных для каждого игрока, от полных новичков до начинающих мастеров Судоку:",
            difficultyEasyDesc: "<strong>Легко:</strong> Идеально подходит для новичков в Судоку или тех, кто ищет расслабляющий умственный отдых. Множество стартовых чисел обеспечивают мягкое введение, помогая вам быстро освоить правила Судоку и обрести уверенность. Это идеальная отправная точка для вашей ежедневной порции головоломок!",
            difficultyMediumDesc: "<strong>Средне:</strong> Сбалансированный вызов для игроков с некоторым опытом Судоку. Меньшее количество начальных чисел требует более стратегического мышления, предлагая полезное сочетание веселья и умственных упражнений.",
            difficultyHardDesc: "<strong>Сложно:</strong> Готовы углубить свои навыки Судоку? Этот уровень содержит значительно более пустую сетку, требующую более сфокусированного логического мышления и продвинутых стратегий Судоку. Это ваш следующий шаг к мастерству головоломок.",
            difficultyExpertDesc: "<strong>Эксперт:</strong> Разработан для опытных решателей, которые жаждут настоящей умственной тренировки. С минимальными начальными подсказками этот уровень является настоящим испытанием ваших способностей к дедукции и решению проблем.",
            difficultyMasterDesc: "<strong>Мастер:</strong> Предназначен для тех, кто действительно преуспевает в числовых головоломках. Этот уровень расширяет границы обычных методов Судоку, предлагая интенсивный и очень полезный опыт для преданных энтузиастов логических игр.",
            difficultyExtremeDesc: "<strong>Экстремально:</strong> Наша окончательная задача. Этот уровень представляет наименьшее количество стартовых чисел, это устрашающая «гора» только для самых проницательных экспертов Судоку. Если вы без усилий освоили уровень «Эксперт» и ищете вершину умственной ловкости, это для вас!",
            difficultySelectionTip: "Просто используйте интуитивно понятное выпадающее меню в верхней части страницы, чтобы выбрать желаемый уровень сложности. Каждая <strong>головоломка Судоку</strong> на нашем сайте генерируется случайным образом, что гарантирует, что вы никогда не будете играть на одной и той же доске дважды! Это гарантирует бесконечное <strong>веселье Судоку</strong> и действительно уникальную <strong>сессию тренировки мозга</strong> каждый раз.",
            navigatingGameTitle: "Навигация по игре: Простое и умное управление",
            navigatingGameText1: "Перед началом каждой игры вы увидите краткий набор инструкций, которые помогут вам в вашем приключении с Мастером Судоку. Вы быстро освоитесь:",
            navigatingGameText2: "<strong>Выбрать и заполнить:</strong> Нажмите на любую пустую ячейку на <strong>сетке Судоку</strong>, чтобы выбрать ее. Затем используйте панель ввода чисел справа от игрового поля (или цифровые клавиши клавиатуры), чтобы поместить цифру от 1 до 9. Так просто <strong>решить Судоку онлайн</strong>!",
            navigatingGameText3: "<strong>Помощник по выделению:</strong> Выберите любое предварительно заполненное или правильно размещенное число на доске, и наша интеллектуальная система мгновенно выделит все идентичные числа по всей сетке. Эта визуальная помощь невероятно полезна для отслеживания распределения чисел и планирования вашего следующего хода, значительно помогая вашим <strong>техникам решения Судоку</strong>.",
            navigatingGameText4: "<strong>Использовать «Режим заметок»:</strong> Нажмите на значок карандаша (<i class='fas fa-pencil-alt'></i>), чтобы переключиться в «Режим заметок». Эта мощная функция позволяет вам делать небольшие карандашные пометки (числа-кандидаты) в ячейке, не фиксируя окончательный ответ. Это незаменимый <strong>инструмент стратегии Судоку</strong> для проверки ваших догадок и выполнения сложных дедукций, особенно в <strong>сложных головоломках Судоку</strong>.",
            navigatingGameText5: "<strong>Легкое стирание:</strong> Нужно исправить число или очистить свои заметки? Просто выберите ячейку снова и нажмите значок ластика (<i class='fas fa-eraser'></i>) или нажмите клавишу «0» на клавиатуре.",
            navigatingGameText6: "Эти полезные инструкции будут появляться в начале каждой новой игры. Если вы предпочитаете сразу приступить к игре, вы можете легко отключить их в меню настроек (ищите значок шестеренки <i class='fas fa-cog'></i> — в настоящее время не реализовано). В настройках вы также можете настроить другие параметры, такие как «Анимация доски» или «Разрешить ошибки» (эти функции еще не реализованы в коде).",
            errorSystemTitle: "Наша умная система ошибок: Учитесь и совершенствуйтесь без разочарований",
            errorSystemText1: "Для новичков мы настоятельно рекомендуем оставлять включенной функцию «Разрешить ошибки». Это означает, что вы можете свободно размещать числа без немедленного штрафа, что позволяет вам <strong>учиться на практике</strong> и исследовать возможности. Когда вы будете готовы к дополнительному испытанию, отключите эту функцию — каждая неправильная запись будет добавлять 15 секунд к вашему таймеру (эта функция еще не реализована), что является отличным способом <strong>улучшить концентрацию и точность</strong> по мере продвижения к освоению Судоку.",
            errorSystemText2: "Даже с включенной функцией «Разрешить ошибки» Мастер Судоку мгновенно выделит любые нарушения правил. Если вы разместите число, которое создает дубликат в любой строке, столбце или блоке 3x3, проблемные ячейки будут немедленно отмечены ярко-красным цветом — как показано ниже:",
            errorSystemText3: "В этом примере вы можете видеть две «2», выделенные красным цветом в нижнем левом блоке 3x3, а также в их соответствующих строке и столбце. Эта мгновенная обратная связь предотвращает глубокое погружение в сложную головоломку Судоку только для того, чтобы обнаружить скрытую ошибку намного позже. Ошибки помечаются немедленно, что позволяет быстро исправить их и получить более плавный и приятный <strong>опыт решения Судоку</strong>.",
            callToAction: "Готовы <strong>играть в бесплатное Судоку онлайн</strong> и дать своему мозгу ultimate <strong>умственную тренировку</strong>? Начните свое испытание прямо сейчас на <strong>Мастере Судоку</strong> — где вас ждут бесконечные <strong>логические головоломки</strong>!",
            rulesTitle: "Правила игры Судоку",
            rulesContent: "Судоку — это логическая, комбинаторная головоломка с размещением чисел. Цель состоит в том, чтобы заполнить сетку 9×9 цифрами так, чтобы каждый столбец, каждая строка и каждый из девяти блоков 3×3, составляющих сетку (также называемые «коробками», «блоками» или «регионами»), содержал все цифры от 1 до 9. Составитель головоломки предоставляет частично заполненную сетку, которая для хорошо составленной головоломки имеет единственное решение. Эта классическая игра для мозга развивает ваше логическое мышление и улучшает память.",
            strategyTitle: "Стратегии Судоку и советы - Развивайте свои логические навыки",
            strategyContent1: "1. <strong>Наблюдение (сканирование):</strong> Начните с просмотра строк, столбцов и блоков 3x3 на предмет отсутствующих чисел. Ищите, где число может поместиться только в одной конкретной ячейке.",
            strategyContent2: "2. <strong>Исключение (перекрестная штриховка):</strong> Используйте существующие числа, чтобы исключить возможности для других ячеек. Если число присутствует в строке, столбце или блоке, оно не может находиться в других ячейках той же строки, столбца или блока.",
            strategyContent3: "3. <strong>Открытые/Скрытые одиночки:</strong> Определите ячейки или числа, которые имеют только одно возможное значение (Открытая одиночка) или только одну возможную позицию в определенной области (Скрытая одиночка).",
            strategyContent4: "4. <strong>Стратегии пар/троек:</strong> Ищите пары или тройки чисел, которые ограничены определенным набором ячеек в строке, столбце или блоке, что позволяет исключить их из других ячеек.",
            strategyEnding: "Практикуя эти методы решения Судоку, вы сможете значительно улучшить свое логическое мышление и навыки решения проблем. Играйте ежедневно для полноценной тренировки мозга!",
            footerText: "&copy; 2025 Мастер Судоку. Все права защищены. Играйте в бесплатные онлайн-головоломки Судоку ежедневно!",

            pauseGameTitle: "Приостановить игру",
            changeLanguageTitle: "Изменить язык",
            toggleThemeTitle: "Переключить темный/светлый режим",
            undoTitle: "Отменить",
            noteModeTitle: "Режим заметок",
            eraseTitle: "Стереть",
            hintTitle: "Подсказка",

            noPuzzleData: "Нет данных для головоломки {difficulty}. Начинаем с легкой.",
            difficultySelected: "Выбрана сложность: {difficulty}. Нажмите «Новая игра», чтобы начать новую головоломку.",
            clearInputPanel: "Очистить",
            gameOver: "Игра окончена! Слишком много ошибок.",
            undoNotAvailable: "Нет больше ходов для отмены.",
            noteModeOn: "Режим заметок ВКЛ",
            noteModeOff: "Режим заметок ВЫКЛ",
            gamePaused: "Игра приостановлена",
            gameResumed: "Игра возобновлена",
            clearMainNumberFirst: "Очистите основное число, чтобы добавить заметки.",
            hintProvided: "Подсказка предоставлена!",
            noEmptyCellsForHint: "Нет пустых ячеек для подсказки или все ячейки заполнены правильно.",
            videoSectionTitle: "Видеоуроки и решения Судоку",
            videoSectionIntro: "Посмотрите наши пошаговые видеоруководства, чтобы научиться играть в Судоку, освоить продвинутые стратегии и увидеть, как решаются экспертные головоломки. Повысьте свой уровень игры и станьте настоящим мастером Судоку!",
            videoTitle1: "Судоку для начинающих: Правила и первые шаги",
            videoDesc1: "Изучите основные правила Судоку и как делать первые ходы. Идеально подходит для абсолютных новичков!",
            videoTitle2: "Продвинутая стратегия Судоку: Открытые и скрытые одиночки",
            videoDesc2: "Погрузитесь глубже в Судоку с помощью мощных методов, таких как Открытые одиночки и Скрытые одиночки.",
            videoTitle3: "Решение экспертного Судоку - Пошаговое руководство",
            videoDesc3: "Посмотрите, как эксперт решает сложную головоломку Судоку, и узнайте его мыслительный процесс."
        }
    };


    // --- 核心游戏逻辑函数 ---

    /**
     * 初始化游戏盘面。
     * @param {Array<Array<number>>} sudokuBoard - 9x9 数独谜题数组。
     */
    function initGame(sudokuBoard) {
        // 重置游戏状态
        clearInterval(timerInterval);
        seconds = 0;
        isPaused = false;
        errorCount = 0;
        isNoteMode = false;
        historyStack = []; // 重置历史栈
        historyPointer = -1;

        // 更新UI至新游戏状态
        updateTimerDisplay(); // 初始化计时器文本
        updateErrorCountDisplay(); // 更新错误计数显示
        messageDisplay.textContent = ''; // 清空消息
        updatePauseButtonIcon(); // 更新暂停按钮图标
        noteModeBtn.classList.remove('active'); // 取消笔记模式UI激活状态

        // 重新启用输入（若之前因游戏结束而禁用）
        toggleGameInteraction(true);
        
        sudokuContainer.innerHTML = ''; // 清空旧的数独网格
        selectedCell = null; // 清除选中单元格状态

        currentSudoku = JSON.parse(JSON.stringify(sudokuBoard)); // 深拷贝当前谜题
        initialSudoku = JSON.parse(JSON.stringify(sudokuBoard)); // 深拷贝初始谜题，用于重置

        // 渲染数独网格
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.dataset.pencilNotes = ''; // 为每个单元格初始化笔记数据

                if (sudokuBoard[r][c] !== 0) {
                    cell.textContent = sudokuBoard[r][c];
                    cell.classList.add('initial'); // 初始数字不可编辑
                } else {
                    cell.classList.add('user-input'); // 用户可输入单元格
                    cell.addEventListener('click', () => selectCell(cell)); // 绑定点击事件
                }
                sudokuContainer.appendChild(cell);
            }
        }
        startTimer(); // 启动计时器
        updateDifficultyDropdownText(); // 更新难度选择下拉菜单文本
        updateActiveDifficultyInMenu(); // 更新难度选择菜单中的激活状态
        saveState(); // 保存初始状态到历史栈
    }

    /**
     * 选中一个单元格，并高亮相关行、列和宫格。
     * @param {HTMLElement} cell - 被选中的单元格DOM元素。
     */
    function selectCell(cell) {
        if (selectedCell) {
            selectedCell.classList.remove('selected'); // 移除之前选中的单元格的样式
            removeHighlights(); // 移除之前的高亮
        }
        selectedCell = cell;
        selectedCell.classList.add('selected'); // 添加选中样式
        highlightRelatedCells(selectedCell.dataset.row, selectedCell.dataset.col); // 高亮相关单元格
    }

    /**
     * 高亮选定单元格所在行、列和3x3宫格。
     * @param {string} row - 选定单元格的行索引。
     * @param {string} col - 选定单元格的列索引。
     */
    function highlightRelatedCells(row, col) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        document.querySelectorAll('.cell').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);

            // 检查是否在同一行、同一列或同一3x3宫格
            const inSameRow = r === parseInt(row);
            const inSameCol = c === parseInt(col);
            const inSameBlock = (Math.floor(r / 3) * 3 === startRow) && (Math.floor(c / 3) * 3 === startCol);

            if (cell !== selectedCell && (inSameRow || inSameCol || inSameBlock)) {
                cell.classList.add('highlight');
            }
        });
    }

    /**
     * 移除所有高亮单元格的样式。
     */
    function removeHighlights() {
        document.querySelectorAll('.cell.highlight').forEach(cell => {
            cell.classList.remove('highlight');
        });
    }

    /**
     * 检查给定数字在数独盘面中是否产生冲突（行、列、宫格内重复）。
     * @param {number} row - 要检查的行索引。
     * @param {number} col - 要检查的列索引。
     * @param {number} value - 要检查的数字。
     * @returns {boolean} - 如果有冲突则返回 true，否则返回 false。
     */
    function checkConflicts(row, col, value) {
        // 检查行
        for (let c = 0; c < 9; c++) {
            if (c !== col && currentSudoku[row][c] === value) return true;
        }
        // 检查列
        for (let r = 0; r < 9; r++) {
            if (r !== row && currentSudoku[r][col] === value) return true;
        }
        // 检查3x3宫格
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if ((r !== row || c !== col) && currentSudoku[r][c] === value) return true;
            }
        }
        return false;
    }

    /**
     * 更新所有用户输入单元格的错误状态并更新总错误计数。
     */
    function updateAllCellErrorStates() {
        let currentTotalErrors = 0;
        document.querySelectorAll('.cell.user-input').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            const cellValue = currentSudoku[r][c];

            if (cellValue !== 0 && checkConflicts(r, c, cellValue)) {
                cell.classList.add('error');
                currentTotalErrors++;
            } else {
                cell.classList.remove('error');
            }
        });
        errorCount = currentTotalErrors;
        updateErrorCountDisplay();
    }

    /**
     * 更新选中单元格的值（主数字或笔记）。
     * @param {number} value - 要输入到单元格的数字 (0 表示清除)。
     */
    function updateCell(value) {
        if (!selectedCell || selectedCell.classList.contains('initial') || isPaused) return;

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        // 处理笔记模式
        if (isNoteMode) {
            handleNoteMode(value, row, col);
            saveState(); // 笔记操作也保存状态
            return;
        }

        // 标准输入模式
        // 在标准输入前，移除当前单元格的任何笔记
        selectedCell.dataset.pencilNotes = '';
        selectedCell.classList.remove('note-mode-display');
        selectedCell.innerHTML = ''; // 清除笔记的HTML内容

        // 更新currentSudoku和单元格文本
        if (value === 0 || value === '') {
            selectedCell.textContent = '';
            currentSudoku[row][col] = 0;
        } else {
            selectedCell.textContent = value;
            currentSudoku[row][col] = value;
        }

        updateAllCellErrorStates(); // 重新计算并高亮所有冲突，并更新总错误计数

        // 检查游戏结束条件 (错误数超标)
        if (errorCount >= maxErrors) {
            gameOver();
            return;
        }

        // 检查游戏胜利条件
        checkWinCondition();
        saveState(); // 保存状态到历史栈
    }

    /**
     * 处理笔记模式下的数字输入。
     * @param {number} value - 要添加/移除的笔记数字 (0表示清除所有笔记)。
     * @param {number} row - 单元格行索引。
     * @param {number} col - 单元格列索引。
     */
    function handleNoteMode(value, row, col) {
        // 如果单元格有主数字，则不能添加笔记
        if (selectedCell.textContent !== '') {
            messageDisplay.textContent = translations[currentLanguage].clearMainNumberFirst; // 使用翻译
            return; 
        }

        let currentNotes = selectedCell.dataset.pencilNotes ? selectedCell.dataset.pencilNotes.split('') : [];
        const valueStr = String(value);

        if (value === 0 || value === '') { // 0 或空表示清除所有笔记
            currentNotes = [];
        } else {
            const index = currentNotes.indexOf(valueStr);
            if (index > -1) {
                currentNotes.splice(index, 1); // 如果笔记已存在，则移除
            } else {
                if (currentNotes.length < 9) { // 限制笔记数量，防止溢出
                    currentNotes.push(valueStr); // 如果笔记不存在，则添加
                }
            }
        }
        currentNotes.sort((a, b) => parseInt(a) - parseInt(b)); // 笔记按数字大小排序
        selectedCell.dataset.pencilNotes = currentNotes.join('');
        renderNotes(selectedCell, currentNotes); // 重新渲染笔记
    }

    /**
     * 在单元格中渲染笔记。
     * @param {HTMLElement} cell - 单元格DOM元素。
     * @param {Array<string>} notesArray - 笔记数字数组。
     */
    function renderNotes(cell, notesArray) {
        cell.innerHTML = ''; // 清空单元格内容（主数字或旧笔记）
        if (notesArray.length > 0) {
            cell.classList.add('note-mode-display'); // 添加笔记模式显示类
            cell.classList.remove('user-input'); // 移除用户输入类（避免样式冲突）

            const notesDiv = document.createElement('div');
            notesDiv.classList.add('pencil-notes'); // 笔记容器
            notesArray.forEach(note => {
                const span = document.createElement('span');
                span.textContent = note;
                notesDiv.appendChild(span);
            });
            cell.appendChild(notesDiv);
        } else {
            cell.classList.remove('note-mode-display'); // 移除笔记模式显示类
            // 如果单元格不是初始数字且清空了笔记，它就应该再次是可输入的
            if (!cell.classList.contains('initial')) {
                cell.classList.add('user-input'); // 重新添加用户输入类
            }
            // 如果单元格在 currentSudoku 中有主数字，这里应该显示出来
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (currentSudoku[row][col] !== 0) {
                cell.textContent = currentSudoku[row][col];
            }
        }
    }

    /**
     * 检查游戏是否胜利。
     * 胜利条件：所有单元格都被正确填满且无冲突、无笔记。
     * @returns {boolean} - 游戏胜利返回 true，否则返回 false。
     */
    function checkWinCondition() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = sudokuContainer.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                // 如果有空位，或者有错误，或者有笔记，则未胜利
                if (currentSudoku[r][c] === 0 || cell.classList.contains('error') || cell.classList.contains('note-mode-display')) {
                    return false;
                }
            }
        }

        clearInterval(timerInterval); // 停止计时器
        const timeElapsed = timerDisplay.textContent; // 获取最终时间
        messageDisplay.textContent = `${translations[currentLanguage].winMessage} ${timeElapsed}!`; // 显示胜利消息
        // 可以在这里添加胜利动画或效果
        return true;
    }

    /**
     * 启动游戏计时器。
     */
    function startTimer() {
        timerInterval = setInterval(() => {
            if (!isPaused) {
                seconds++;
                updateTimerDisplay(); // 更新计时器显示
            }
        }, 1000);
    }

    /**
     * 更新计时器在UI上的显示。
     */
    function updateTimerDisplay() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    /**
     * 更新错误计数在UI上的显示。
     */
    function updateErrorCountDisplay() {
        errorCountDisplay.textContent = translations[currentLanguage].errorCount
            .replace('{current}', errorCount)
            .replace('{max}', maxErrors);
            
        // 根据错误数量改变颜色
        if (errorCount >= maxErrors) {
            errorCountDisplay.style.color = 'var(--accent-error)';
        } else {
            errorCountDisplay.style.color = isDarkMode ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'; 
        }
    }

    /**
     * 游戏结束（当错误数达到上限时）。
     */
    function gameOver() {
        clearInterval(timerInterval); // 停止计时器
        messageDisplay.textContent = translations[currentLanguage].gameOver; // 显示游戏结束消息
        
        // 禁用所有输入和操作
        toggleGameInteraction(false);
    }

    /**
     * 启用或禁用游戏交互元素。
     * @param {boolean} enable - true 为启用，false 为禁用。
     */
    function toggleGameInteraction(enable) {
        document.querySelectorAll('.cell.user-input').forEach(cell => {
            cell.style.pointerEvents = enable ? 'auto' : 'none'; // 禁用单元格点击
        });
        numInputButtons.forEach(btn => btn.disabled = !enable); // 禁用数字输入按钮
        undoBtn.disabled = !enable;
        noteModeBtn.disabled = !enable;
        eraseBtn.disabled = !enable;
        hintBtn.disabled = !enable;
        newGameBottomBtn.disabled = !enable;
    }

    // --- Undo/Redo Functions ---

    /**
     * 将当前游戏状态保存到历史栈。
     * 状态包括数独盘面数字和每个单元格的DOM状态（文本、笔记、错误/笔记模式类）。
     */
    function saveState() {
        // 如果有撤销操作后进行了新操作，则清除未来的历史
        if (historyPointer < historyStack.length - 1) {
            historyStack = historyStack.slice(0, historyPointer + 1);
        }

        const state = {
            sudoku: JSON.parse(JSON.stringify(currentSudoku)), // 深拷贝盘面数字
            cellStates: [], // 存储每个单元格的DOM状态
            errorCount: errorCount // 保存当前错误计数
        };

        document.querySelectorAll('.cell').forEach(cell => {
            state.cellStates.push({
                row: parseInt(cell.dataset.row),
                col: parseInt(cell.dataset.col),
                textContent: cell.textContent,
                pencilNotes: cell.dataset.pencilNotes,
                classList: Array.from(cell.classList) // 保存所有类名
            });
        });

        historyStack.push(state);
        historyPointer++;
    }

    /**
     * 撤销上一步操作。
     */
    function undo() {
        if (historyPointer <= 0) { // 不能撤销初始状态或无更多操作可撤销
            messageDisplay.textContent = translations[currentLanguage].undoNotAvailable;
            return;
        }

        historyPointer--; // 指针前移
        applyState(historyStack[historyPointer]); // 应用上一个状态
        messageDisplay.textContent = ''; // 清除撤销消息
    }

    /**
     * 应用指定历史状态到游戏盘面。
     * @param {Object} state - 要应用的特定历史状态。
     */
    function applyState(state) {
        currentSudoku = JSON.parse(JSON.stringify(state.sudoku)); // 恢复盘面数字
        errorCount = state.errorCount; // 恢复错误计数
        updateErrorCountDisplay(); // 更新错误计数显示

        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const savedCellState = state.cellStates.find(s => s.row === row && s.col === col);

            if (savedCellState) {
                // 重置所有类到'cell'，然后重新添加保存的类
                cell.className = 'cell'; 
                savedCellState.classList.forEach(cls => {
                    if (cls !== 'cell') cell.classList.add(cls);
                });
                
                cell.textContent = savedCellState.textContent; // 恢复主文本
                cell.dataset.pencilNotes = savedCellState.pencilNotes; // 恢复笔记数据

                // 重新渲染笔记或主数字
                if (savedCellState.pencilNotes) {
                    renderNotes(cell, savedCellState.pencilNotes.split(''));
                } else {
                    cell.innerHTML = savedCellState.textContent; // 恢复主文本或清空
                }

                // 确保 user-input 类正确
                if (currentSudoku[row][col] === 0 && !cell.classList.contains('initial') && !cell.classList.contains('note-mode-display')) {
                    cell.classList.add('user-input');
                } else {
                    cell.classList.remove('user-input');
                }
            }
        });
        // 确保选中状态被清除 (撤销操作后通常取消选中)
        if (selectedCell) {
            selectedCell.classList.remove('selected'); 
            removeHighlights(); 
            selectedCell = null; // 清除selectedCell引用
        }
    }


    // --- General Functions ---

    /**
     * 应用当前语言的翻译文本到所有data-lang-key的DOM元素。
     */
    function applyTranslations() {
        // 1. 更新<html>标签的lang属性
        document.documentElement.lang = currentLanguage;

        // 2. 更新<title>和<meta description>
        document.title = translations[currentLanguage].pageTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', translations[currentLanguage].pageDescription);
        document.querySelector('meta[name="keywords"]').setAttribute('content', translations[currentLanguage].pageKeywords);


        // 3. 遍历所有带有data-lang-key的元素
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.dataset.langKey;
            let text = translations[currentLanguage][key];
            if (text) {
                // 特殊处理带占位符的文本
                if (key === 'errorCount') {
                    text = text.replace('{current}', errorCount).replace('{max}', maxErrors);
                } else if (key === 'difficultySelected' || key === 'noPuzzleData') {
                    const translatedDifficulty = translations[currentLanguage]['difficulty' + currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)] || currentDifficulty;
                    text = text.replace('{difficulty}', translatedDifficulty);
                }
                
                // 确保不重复更新某些由JS自身更新的元素（如title, 计时器, 错误计数）
                // 注意：'difficulty-dropdown-btn' 和 'timer' 是特殊处理的，因为它们有子元素或动态内容
                // 'error-count' 在 updateErrorCountDisplay() 中处理
                if (element.tagName !== 'TITLE' && !['difficulty-dropdown-btn', 'timer', 'error-count'].includes(element.id)) {
                    element.innerHTML = text; // 使用 innerHTML 以支持粗体等HTML标签
                }
            }
        });

        // 4. 更新带有data-lang-title-key的元素的title属性（新的处理）
        document.querySelectorAll('[data-lang-title-key]').forEach(element => {
            const key = element.dataset.langTitleKey;
            const titleText = translations[currentLanguage][key];
            if (titleText) {
                element.setAttribute('title', titleText);
            }
        });

        // 5. 强制更新一些动态文本显示
        updateTimerDisplay(); // 确保计时器文本也更新
        updateErrorCountDisplay(); // 确保错误计数显示更新
        updateDifficultyDropdownText(); // 确保难度下拉按钮文本更新

        // 6. 统一处理消息显示区的翻译（更稳健的方式）
        const currentMessageText = messageDisplay.textContent.trim();
        if (currentMessageText) { // 只有当消息显示区有内容时才尝试翻译
            let foundKey = null;
            // 遍历英文翻译，找到匹配的key
            for (const key in translations.en) { 
                // 创建一个用于匹配的模式，替换可能的占位符
                let pattern = translations.en[key]
                    .replace(/\{current\}/g, '(\\d+)') // 匹配数字
                    .replace(/\{max\}/g, '(\\d+)')     // 匹配数字
                    .replace(/\{difficulty\}/g, '(.+?)'); // 匹配任意字符

                // 移除HTML标签以便匹配纯文本
                pattern = pattern.replace(/<\/?strong>/g, '');
                pattern = pattern.replace(/<i class='fas fa-undo'><\/i>/g, '');
                pattern = pattern.replace(/<i class='fas fa-pencil-alt'><\/i>/g, '');
                pattern = pattern.replace(/<i class='fas fa-eraser'><\/i>/g, '');
                pattern = pattern.replace(/<i class='fas fa-lightbulb'><\/i>/g, '');
                pattern = pattern.replace(/<i class='fas fa-cog'><\/i>/g, '');

                // 转义特殊正则表达式字符，除了我们自己定义的占位符
                pattern = pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\`]/g, "\\$&");
                
                // winMessage后面有动态时间，需要特殊处理匹配
                if (key === 'winMessage') {
                     // 精确匹配 winMessage 的固定部分，后面跟任意字符（时间）
                    const winPattern = translations.en[key].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\`]/g, "\\$&");
                    if (currentMessageText.startsWith(winPattern)) {
                        messageDisplay.textContent = `${translations[currentLanguage].winMessage} ${timerDisplay.textContent}!`;
                        return; // 已处理，直接返回
                    }
                } else if (new RegExp(`^${pattern}$`).test(currentMessageText)) { // 精确匹配整个文本
                    foundKey = key;
                    break;
                }
            }
            
            if (foundKey) {
                let translatedMessage = translations[currentLanguage][foundKey];
                // 重新处理占位符，因为messageDisplay可能已经被更新
                if (foundKey === 'errorCount') {
                    translatedMessage = translatedMessage.replace('{current}', errorCount).replace('{max}', maxErrors);
                } else if (foundKey === 'difficultySelected' || foundKey === 'noPuzzleData') {
                    const translatedDifficulty = translations[currentLanguage]['difficulty' + currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)] || currentDifficulty;
                    translatedMessage = translatedMessage.replace('{difficulty}', translatedDifficulty);
                }
                messageDisplay.textContent = translatedMessage;
            }
        }
    }


    /**
     * 绑定语言切换按钮事件。
     */
    langDropdownBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // 阻止事件冒泡，防止立即关闭
        langDropdownMenu.classList.toggle('show'); // 切换显示/隐藏
        difficultyDropdownMenu.classList.remove('show'); // 关闭其他下拉菜单
    });

    /**
     * 绑定语言选择项点击事件。
     */
    langButtonsInMenu.forEach(button => {
        button.addEventListener('click', () => {
            currentLanguage = button.dataset.lang; // 设置当前语言
            applyTranslations(); // 应用翻译
            langDropdownMenu.classList.remove('show'); // 隐藏菜单
            localStorage.setItem('sudokuLang', currentLanguage); // 保存偏好
            updateActiveLangInMenu(); // 更新菜单中激活状态
        });
    });

    /**
     * 绑定主题切换按钮事件。
     */
    themeToggleButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode; // 切换主题状态
        document.body.classList.toggle('dark-mode', isDarkMode); // 切换 body 类
        const icon = themeToggleButton.querySelector('i'); // 切换图标
        icon.classList.toggle('fa-moon', !isDarkMode);
        icon.classList.toggle('fa-sun', isDarkMode);
        localStorage.setItem('sudokuTheme', isDarkMode ? 'dark' : 'light'); // 保存偏好
        updateErrorCountDisplay(); // 更新错误计数颜色以匹配主题
    });

    /**
     * 绑定难度选择下拉菜单事件。
     */
    difficultyDropdownBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // 阻止事件冒泡
        difficultyDropdownMenu.classList.toggle('show'); // 切换显示/隐藏
        langDropdownMenu.classList.remove('show'); // 关闭其他下拉菜单
    });

    /**
     * 绑定难度选择项点击事件。
     */
    difficultyButtonsInMenu.forEach(button => {
        button.addEventListener('click', () => {
            currentDifficulty = button.dataset.difficulty; // 设置当前难度
            localStorage.setItem('sudokuDifficulty', currentDifficulty); // 保存偏好
            updateDifficultyDropdownText(); // 更新下拉按钮文本
            updateActiveDifficultyInMenu(); // 更新菜单中激活状态
            difficultyDropdownMenu.classList.remove('show'); // 隐藏菜单
            
            // !!! 自动开始新游戏，直接调用生成器 !!!
            const generatedPuzzle = SudokuGenerator.getSudokuByDifficulty(currentDifficulty);
            initGame(generatedPuzzle); // 使用生成的谜题初始化游戏
        });
    });

    /**
     * 点击文档其他地方时关闭所有下拉菜单。
     */
    document.addEventListener('click', (event) => {
        if (!difficultyDropdownMenu.contains(event.target) && event.target !== difficultyDropdownBtn) {
            difficultyDropdownMenu.classList.remove('show');
        }
        if (!langDropdownMenu.contains(event.target) && event.target !== langDropdownBtn) {
            langDropdownMenu.classList.remove('show');
        }
    });

    /**
     * 根据当前难度更新难度选择下拉按钮的文本。
     */
    function updateDifficultyDropdownText() {
        const currentDifficultyNameKey = 'difficulty' + currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
        const translatedDifficulty = translations[currentLanguage][currentDifficultyNameKey] || currentDifficulty;
        difficultyDropdownBtn.innerHTML = `${translatedDifficulty} <i class="fas fa-chevron-down"></i>`;
    }

    /**
     * 更新语言选择菜单中当前激活语言的样式。
     */
    function updateActiveLangInMenu() {
        langButtonsInMenu.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
        });
    }

    /**
     * 更新难度选择菜单中当前激活难度的样式。
     */
    function updateActiveDifficultyInMenu() {
        difficultyButtonsInMenu.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
        });
    }

    // --- 游戏操作按钮事件 ---
    /**
     * 绑定底部“新游戏”按钮事件。
     */
    newGameBottomBtn.addEventListener('click', () => {
        const generatedPuzzle = SudokuGenerator.getSudokuByDifficulty(currentDifficulty);
        initGame(generatedPuzzle); // 使用生成的谜题初始化游戏
    });

    /**
     * 绑定撤销按钮事件。
     */
    undoBtn.addEventListener('click', undo); // 直接引用函数

    /**
     * 绑定笔记模式按钮事件。
     */
    noteModeBtn.addEventListener('click', () => {
        isNoteMode = !isNoteMode; // 切换笔记模式状态
        noteModeBtn.classList.toggle('active', isNoteMode); // 切换按钮激活样式
        messageDisplay.textContent = isNoteMode ? translations[currentLanguage].noteModeOn : translations[currentLanguage].noteModeOff;
    });

    /**
     * 绑定橡皮擦按钮事件。
     */
    eraseBtn.addEventListener('click', () => {
        // 如果有选中的单元格
        if (selectedCell) {
            // 如果是笔记模式，清除笔记
            if (isNoteMode) {
                selectedCell.dataset.pencilNotes = '';
                renderNotes(selectedCell, []); // 重新渲染笔记
                saveState(); // 保存状态
            } else { // 否则，清除主数字
                updateCell(0); // 清除主数字，此函数内部会保存状态
            }
        }
    });

    /**
     * 绑定提示按钮事件 (简易实现)。
     */
    hintBtn.addEventListener('click', () => {
        if (isPaused) return; // 暂停时禁用
        
        // 寻找第一个空单元格并尝试找到合法数字
        let emptyCell = null;
        let hintValue = null;

        // 遍历寻找第一个可填写的空单元格
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentSudoku[r][c] === 0 && !document.querySelector(`[data-row="${r}"][data-col="${c}"]`).classList.contains('initial')) {
                    // 尝试找到一个在此位置合法的数字
                    for (let val = 1; val <= 9; val++) {
                        if (!checkConflicts(r, c, val)) {
                            emptyCell = sudokuContainer.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                            hintValue = val;
                            break; // 找到一个合法数字就退出
                        }
                    }
                }
                if (emptyCell) break; // 找到空单元格就退出外层循环
            }
            if (emptyCell) break;
        }

        if (emptyCell && hintValue) {
            // 应用提示
            const originalSelectedCell = selectedCell; // 临时保存当前选中单元格
            selectedCell = emptyCell; // 临时选中单元格以便 updateCell 操作
            updateCell(hintValue); // 填入提示数字
            selectedCell = originalSelectedCell; // 恢复之前的选中单元格
            messageDisplay.textContent = translations[currentLanguage].hintProvided; // 显示提示信息
        } else {
            messageDisplay.textContent = translations[currentLanguage].noEmptyCellsForHint;
        }
    });

    /**
     * 绑定暂停/播放按钮事件。
     */
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused; // 切换暂停状态
        updatePauseButtonIcon(); // 更新按钮图标
        messageDisplay.textContent = isPaused ? translations[currentLanguage].gamePaused : translations[currentLanguage].gameResumed;
        
        // 禁用/启用输入和操作
        toggleGameInteraction(!isPaused);
    });

    /**
     * 更新暂停/播放按钮的图标。
     */
    function updatePauseButtonIcon() {
        const icon = pauseBtn.querySelector('i');
        icon.classList.toggle('fa-pause', !isPaused);
        icon.classList.toggle('fa-play', isPaused);
    }


    // 监听键盘输入事件
    document.addEventListener('keydown', (e) => {
        if (selectedCell && !selectedCell.classList.contains('initial') && !isPaused) {
            if (e.key >= '1' && e.key <= '9') {
                updateCell(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                updateCell(0); // 0 和 Backspace/Delete 都表示清除
            }
        }
    });

    // 监听数字输入面板按钮点击事件
    numInputButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (isPaused) return; // 暂停时禁用输入
            const value = e.target.dataset.value;
            if (value !== undefined) {
                updateCell(parseInt(value));
            }
        });
    });

    // --- 初始化函数 ---
    /**
     * 初始化用户偏好设置（语言、主题、难度）。
     */
    function initializePreferences() {
        // 从 localStorage 加载语言偏好
        const savedLang = localStorage.getItem('sudokuLang');
        if (savedLang && translations[savedLang]) {
            currentLanguage = savedLang;
        }
        updateActiveLangInMenu(); // 设置语言按钮的激活状态
        
        // 从 localStorage 加载主题偏好
        const savedTheme = localStorage.getItem('sudokuTheme');
        isDarkMode = (savedTheme === 'dark');
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeToggleButton.querySelector('i').classList.toggle('fa-moon', !isDarkMode);
        themeToggleButton.querySelector('i').classList.toggle('fa-sun', isDarkMode);

        // 初始化难度按钮文本和选中状态
        const savedDifficulty = localStorage.getItem('sudokuDifficulty');
        currentDifficulty = savedDifficulty || 'easy'; // 默认难度
        
        // 在所有偏好加载并设置完毕后，统一应用翻译
        applyTranslations();
        updateActiveDifficultyInMenu();
    }

    // --- 启动脚本 ---
    initializePreferences(); // 初始化用户偏好
    const initialPuzzle = SudokuGenerator.getSudokuByDifficulty(currentDifficulty);
    initGame(initialPuzzle); // 初始加载谜题并开始游戏
});