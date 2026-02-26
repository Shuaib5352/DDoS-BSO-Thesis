const { contextBridge, ipcRenderer } = require('electron');

/**
 * API Türkçe Yorumlarıyla Temizlenmiş Preload İşlemi
 * Renderer sürecine güvenli IPC kanalları sağlar
 */

// Ortam değişkenlerini tutuştur
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Electron API'sini Renderer içerik alanında göster
 * Sadece güvenli yöntemleri ifşa et
 */
contextBridge.exposeInMainWorld('electron', {
    /**
     * Uygulama Versiyonu Öğren
     * @returns {Promise<string>} - Uygulamanın sürüm numarası
     */
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    /**
     * Uygulama Adı Öğren
     * @returns {Promise<string>} - Uygulamanın adı
     */
    getAppName: () => ipcRenderer.invoke('get-app-name'),

    /**
     * Kullanıcı Verisi Yolunu Öğren
     * @returns {Promise<string>} - Kullanıcı verileri klasörünün yolu
     */
    getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),

    /**
     * Hata İletişim Kutusu Göster
     * @param {object} params - { title: string, message: string }
     * @returns {Promise<number>} - Kullanıcının seçimi
     */
    showErrorDialog: (params) => ipcRenderer.invoke('show-error-dialog', params),

    /**
     * İleti İletişim Kutusu Göster
     * @param {object} params - { title: string, message: string, type: string }
     * @returns {Promise<object>} - İletişim kutusu sonucu
     */
    showMessageDialog: (params) => ipcRenderer.invoke('show-message-dialog', params),

    /**
     * Geliştirme Modunda Olup Olmadığını Kontrol Et
     * @returns {boolean} - Geliştirme modu için true
     */
    isDevelopment: () => !isProduction,

    /**
     * Dosya Açık Penceresine Geri Çağrı Dinle
     * @param {Function} callback - Dosya seçildiğinde çağrılacak fonksiyon
     */
    onFileSelected: (callback) => {
        ipcRenderer.on('file-selected', (event, filePath) => {
            callback(filePath);
        });
    }
});

/**
 * Konsol Uyarıları (Geliştirme Modunda)
 */
if (!isProduction) {
    console.log('[Preload] Electron API başarıyla yüklendi');
}
