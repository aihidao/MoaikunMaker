/**
 * 国际化配置
 */
const i18n = {
    currentLang: 'zh-CN',
    
    translations: {},
    
    /**
     * 加载语言文件
     */
    loadTranslations() {
        // 从外部语言文件加载翻译
        if (typeof translations_zhCN !== 'undefined') {
            this.translations['zh-CN'] = translations_zhCN;
        }
        if (typeof translations_enUS !== 'undefined') {
            this.translations['en-US'] = translations_enUS;
        }
        if (typeof translations_jaJP !== 'undefined') {
            this.translations['ja-JP'] = translations_jaJP;
        }
    },
    
    /**
     * 获取翻译文本
     */
    t(key, params = {}) {
        let translation = this.translations[this.currentLang]?.[key];
        if (!translation) {
            console.warn('缺失翻译 →', this.currentLang, key);
            return key;
        }

        return translation.replace(/{([^}]+)}/g, (match, placeholder) => {
            // 去掉可能的前后空格
            const key = placeholder.trim();
            
            if (key in params) {
                return params[key];
            }
            
            // 可选：支持数字索引作为 fallback
            const num = Number(key);
            if (!isNaN(num) && num in params) {
                return params[num];
            }
            
            // 没找到就保留原样（或返回警告）
            console.warn(`占位符未替换：{${key}} 在 ${this.currentLang}.${this.key}`);
            return match;
        });
    },
    
    /**
     * 切换语言
     */
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updatePage();
    },
    
    /**
     * 更新页面所有文本
     */
    updatePage() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 更新 placeholder 属性
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // 更新 title 属性
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // 更新 select 的 options (场景选择)
        document.querySelectorAll('[data-i18n-options]').forEach(select => {
            const prefix = select.getAttribute('data-i18n-options');
            select.querySelectorAll('option').forEach(option => {
                const value = option.value;
                option.textContent = `${this.t(prefix)} ${value}`;
            });
        });
        
        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang;
    },
    
    /**
     * 初始化
     */
    init() {
        // 加载语言文件
        this.loadTranslations();
        
        // 从 localStorage 读取语言设置
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            this.currentLang = savedLang;
        }
        
        this.updatePage();
        return this.currentLang;
    }
};
