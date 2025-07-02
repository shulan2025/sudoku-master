// 多语言SEO关键词和元标签翻译
// Multi-language SEO Keywords and Meta Tags Translation

const seoTranslations = {
    zh: {
        // 页面标题 (Page Title)
        pageTitle: "Sudoku Master - 数独大师 | 免费在线数独游戏",
        
        // 描述 (Description) - 150-160字符最佳
        metaDescription: "Sudoku Master 免费游玩简单至行家级别的数独游戏。我们的数独网适用于所有浏览器及不同种类的移动式设备。根据困难度选择一个数独拼图并开始享受游戏的乐趣吧！支持每日挑战、智能提示、多语言切换。",
        
        // 关键词 (Keywords) - 相关性高的关键词
        metaKeywords: "数独游戏,sudoku,在线数独,免费数独,数独大师,sudoku master,数独拼图,逻辑游戏,益智游戏,数字游戏,brain training,puzzle game,daily sudoku,数独挑战,数独解谜,每日数独,数独技巧,数独规则",
        
        // Open Graph 描述
        ogDescription: "免费在线数独游戏，支持简单至专家级别的四种难度。适用于所有浏览器和移动设备，提供每日挑战、智能提示、多语言支持等丰富功能。",
        
        // Twitter 描述
        twitterDescription: "免费在线数独游戏，支持四种难度等级，适用于所有设备。提供每日挑战、智能提示等功能，享受数独解谜乐趣！",
        
        // 语言和地区设置
        htmlLang: "zh-CN",
        ogLocale: "zh_CN",
        
        // SEO友好的内容标题
        h1Title: "免费在线数独游戏 - 挑战你的逻辑思维",
        h2Subtitle: "简单到专家级别，适合所有玩家"
    },
    
    en: {
        pageTitle: "Sudoku Master - Free Online Sudoku Game | Play Now",
        metaDescription: "Play free Sudoku games from easy to expert levels. Our Sudoku website works on all browsers and mobile devices. Choose a difficulty level and start enjoying the puzzle fun! Features daily challenges, smart hints, and multi-language support.",
        metaKeywords: "sudoku,online sudoku,free sudoku,sudoku master,sudoku puzzle,logic game,puzzle game,brain training,daily sudoku,sudoku solver,number puzzle,sudoku rules,sudoku tips,sudoku strategy,free puzzle games",
        ogDescription: "Free online Sudoku game with four difficulty levels from easy to expert. Compatible with all browsers and devices, featuring daily challenges, smart hints, and multi-language support.",
        twitterDescription: "Free online Sudoku game with four difficulty levels. Features daily challenges, smart hints, and more. Play now on any device!",
        htmlLang: "en",
        ogLocale: "en_US",
        h1Title: "Free Online Sudoku Game - Challenge Your Logic",
        h2Subtitle: "From Easy to Expert - Perfect for All Players"
    },
    
    ja: {
        pageTitle: "Sudoku Master - 数独大師 | 無料オンライン数独ゲーム",
        metaDescription: "Sudoku Master は簡単からエキスパートレベルまでの無料数独ゲームです。すべてのブラウザとモバイルデバイスに対応。難易度を選んで数独パズルを楽しもう！毎日チャレンジ、スマートヒント、多言語サポート付き。",
        metaKeywords: "数独,sudoku,オンライン数独,無料数独,数独マスター,sudoku master,数独パズル,論理ゲーム,パズルゲーム,脳トレ,デイリー数独,数独ソルバー,数独ルール,数独コツ",
        ogDescription: "無料オンライン数独ゲーム。簡単からエキスパートまでの4つの難易度レベル。すべてのブラウザとデバイスに対応、毎日チャレンジ、スマートヒント、多言語サポート付き。",
        twitterDescription: "4つの難易度レベルの無料オンライン数独ゲーム。毎日チャレンジ、スマートヒントなど。どのデバイスでもプレイ可能！",
        htmlLang: "ja",
        ogLocale: "ja_JP",
        h1Title: "無料オンライン数独ゲーム - 論理思考に挑戦",
        h2Subtitle: "簡単からエキスパートまで - すべてのプレイヤーに最適"
    },
    
    de: {
        pageTitle: "Sudoku Master - Kostenloses Online-Sudoku-Spiel",
        metaDescription: "Spielen Sie kostenlose Sudoku-Spiele vom einfachen bis zum Expertenlevel. Unsere Sudoku-Website funktioniert auf allen Browsern und mobilen Geräten. Wählen Sie einen Schwierigkeitsgrad und genießen Sie das Puzzle-Vergnügen! Mit täglichen Herausforderungen, intelligenten Hinweisen und mehrsprachiger Unterstützung.",
        metaKeywords: "sudoku,online sudoku,kostenloses sudoku,sudoku master,sudoku puzzle,logik spiel,puzzle spiel,gehirntraining,tägliches sudoku,sudoku löser,zahlenrätsel,sudoku regeln,sudoku tipps",
        ogDescription: "Kostenloses Online-Sudoku-Spiel mit vier Schwierigkeitsgraden vom einfachen bis zum Expertenlevel. Kompatibel mit allen Browsern und Geräten, mit täglichen Herausforderungen, intelligenten Hinweisen und mehrsprachiger Unterstützung.",
        twitterDescription: "Kostenloses Online-Sudoku-Spiel mit vier Schwierigkeitsgraden. Mit täglichen Herausforderungen, intelligenten Hinweisen und mehr. Jetzt auf jedem Gerät spielen!",
        htmlLang: "de",
        ogLocale: "de_DE",
        h1Title: "Kostenloses Online-Sudoku-Spiel - Fordern Sie Ihre Logik heraus",
        h2Subtitle: "Von Einfach bis Experte - Perfekt für alle Spieler"
    },
    
    hi: {
        pageTitle: "Sudoku Master - मुफ्त ऑनलाइन सुडोकू गेम",
        metaDescription: "Sudoku Master आसान से एक्सपर्ट लेवल तक मुफ्त सुडोकू गेम खेलें। हमारी सुडोकू वेबसाइट सभी ब्राउज़र और मोबाइल डिवाइस पर काम करती है। कठिनाई स्तर चुनें और पहेली का मज़ा लें! दैनिक चुनौतियों, स्मार्ट हिंट्स और बहुभाषी सपोर्ट के साथ।",
        metaKeywords: "सुडोकू,ऑनलाइन सुडोकू,मुफ्त सुडोकू,सुडोकू मास्टर,सुडोकू पहेली,तर्क खेल,पहेली खेल,दिमागी कसरत,दैनिक सुडोकू,सुडोकू सॉल्वर,संख्या पहेली,सुडोकू नियम",
        ogDescription: "मुफ्त ऑनलाइन सुडोकू गेम आसान से एक्सपर्ट तक चार कठिनाई स्तरों के साथ। सभी ब्राउज़र और डिवाइस के साथ संगत, दैनिक चुनौतियों, स्मार्ट हिंट्स और बहुभाषी सपोर्ट के साथ।",
        twitterDescription: "चार कठिनाई स्तरों के साथ मुफ्त ऑनलाइन सुडोकू गेम। दैनिक चुनौतियां, स्मार्ट हिंट्स और बहुत कुछ। अब किसी भी डिवाइस पर खेलें!",
        htmlLang: "hi",
        ogLocale: "hi_IN",
        h1Title: "मुफ्त ऑनलाइन सुडोकू गेम - अपने तर्क को चुनौती दें",
        h2Subtitle: "आसान से एक्सपर्ट तक - सभी खिलाड़ियों के लिए उपयुक्त"
    },
    
    ru: {
        pageTitle: "Sudoku Master - Бесплатная онлайн игра Судоку",
        metaDescription: "Играйте в бесплатные игры Судоку от простого до экспертного уровня. Наш сайт Судоку работает во всех браузерах и на мобильных устройствах. Выберите уровень сложности и наслаждайтесь головоломкой! С ежедневными вызовами, умными подсказками и многоязычной поддержкой.",
        metaKeywords: "судоку,онлайн судоку,бесплатное судоку,судоку мастер,судоку головоломка,логическая игра,головоломка,тренировка мозга,ежедневное судоку,решатель судоку,числовая головоломка,правила судоку",
        ogDescription: "Бесплатная онлайн игра Судоку с четырьмя уровнями сложности от простого до экспертного. Совместима со всеми браузерами и устройствами, с ежедневными вызовами, умными подсказками и многоязычной поддержкой.",
        twitterDescription: "Бесплатная онлайн игра Судоку с четырьмя уровнями сложности. Ежедневные вызовы, умные подсказки и многое другое. Играйте на любом устройстве!",
        htmlLang: "ru",
        ogLocale: "ru_RU",
        h1Title: "Бесплатная онлайн игра Судоку - Вызов для вашей логики",
        h2Subtitle: "От простого до экспертного - идеально для всех игроков"
    },
    
    fr: {
        pageTitle: "Sudoku Master - Jeu de Sudoku Gratuit en Ligne",
        metaDescription: "Jouez à des jeux de Sudoku gratuits du niveau facile à expert. Notre site web de Sudoku fonctionne sur tous les navigateurs et appareils mobiles. Choisissez un niveau de difficulté et commencez à profiter du plaisir du puzzle ! Avec des défis quotidiens, des indices intelligents et un support multilingue.",
        metaKeywords: "sudoku,sudoku en ligne,sudoku gratuit,sudoku master,puzzle sudoku,jeu de logique,jeu de puzzle,entraînement cérébral,sudoku quotidien,solveur sudoku,puzzle numérique,règles sudoku,astuces sudoku",
        ogDescription: "Jeu de Sudoku gratuit en ligne avec quatre niveaux de difficulté du facile à l'expert. Compatible avec tous les navigateurs et appareils, avec des défis quotidiens, des indices intelligents et un support multilingue.",
        twitterDescription: "Jeu de Sudoku gratuit en ligne avec quatre niveaux de difficulté. Défis quotidiens, indices intelligents et plus encore. Jouez maintenant sur n'importe quel appareil !",
        htmlLang: "fr",
        ogLocale: "fr_FR",
        h1Title: "Jeu de Sudoku Gratuit en Ligne - Défiez votre logique",
        h2Subtitle: "Du facile à l'expert - Parfait pour tous les joueurs"
    }
};

// 导出用于在主文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = seoTranslations;
}

// 全局变量用于直接访问
window.seoTranslations = seoTranslations; 