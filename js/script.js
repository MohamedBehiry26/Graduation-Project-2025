document.addEventListener('DOMContentLoaded', function () {
    const languageDropdownItems = document.querySelectorAll('[data-lang]');
    const elementsToTranslate = document.querySelectorAll('[data-translate]');

    // دالة لتحميل اللغة
    function loadLanguage(lang) {
        fetch(`./languages/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(translations => {
                // الحصول على الصفحة الحالية (مثل "index" لـ "index.html")
                const page = window.location.pathname.split('/').pop().split('.')[0];

                // الحصول على النصوص الخاصة بالصفحة الحالية
                const pageData = translations[page];

                // إذا كانت النصوص موجودة، قم بتحديث العناصر في الصفحة
                if (pageData) {
                    elementsToTranslate.forEach(element => {
                        const key = element.getAttribute('data-translate');
                        if (pageData[key]) {
                            element.textContent = pageData[key];
                        }
                    });
                }

                // حفظ اللغة المفضلة في localStorage
                localStorage.setItem('preferredLanguage', lang);

                // تغيير اتجاه الصفحة بناءً على اللغة
                if (lang === 'ar') {
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.setAttribute('lang', 'ar');
                } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.setAttribute('lang', lang);
                }
            })
            .catch(error => {
                console.error('Error loading language file:', error);
            });
    }

    // إضافة حدث النقر على عناصر القائمة المنسدلة
    languageDropdownItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            loadLanguage(selectedLang);
        });
    });

    // تحميل اللغة المفضلة من localStorage إذا كانت موجودة
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'ar';
    loadLanguage(preferredLanguage);
});