document.addEventListener('DOMContentLoaded', function() {
    const amazonUrlInput = document.getElementById('amazon-url');
    const affiliateUrlOutput = document.getElementById('affiliate-url');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    
    // トラッキングID
    const trackingId = 'nuntanunta506-22';
    
    // 変換ボタンのクリックイベント
    convertBtn.addEventListener('click', function() {
        const originalUrl = amazonUrlInput.value.trim();
        
        if (!originalUrl) {
            alert('Amazonの商品URLを入力してください');
            return;
        }
        
        const affiliateUrl = convertToAffiliateUrl(originalUrl, trackingId);
        affiliateUrlOutput.value = affiliateUrl;
    });
    
    // コピーボタンのクリックイベント
    copyBtn.addEventListener('click', function() {
        if (!affiliateUrlOutput.value) {
            alert('コピーするリンクがありません');
            return;
        }
        
        // テキストエリアの内容をコピー
        affiliateUrlOutput.select();
        document.execCommand('copy');
        
        // コピー完了メッセージを表示
        copyMessage.classList.remove('hidden');
        setTimeout(function() {
            copyMessage.classList.add('hidden');
        }, 2000);
    });
    
    // URLをアフィリエイトリンクに変換する関数
    function convertToAffiliateUrl(url, trackingId) {
        try {
            // URLを解析
            let parsedUrl = new URL(url);
            
            // ドメインがAmazonかチェック
            if (!parsedUrl.hostname.includes('amazon.co.jp') && 
                !parsedUrl.hostname.includes('amazon.jp') && 
                !parsedUrl.hostname.includes('amzn.to')) {
                alert('AmazonのURLを入力してください');
                return url;
            }
            
            // 短縮URLの場合はそのまま使用（展開はしない）
            if (parsedUrl.hostname.includes('amzn.to')) {
                return `${url}?tag=${trackingId}#PR`;
            }
            
            // パスとクエリパラメータを保持
            let path = parsedUrl.pathname;
            let params = new URLSearchParams(parsedUrl.search);
            
            // タグパラメータを追加または更新
            params.set('tag', trackingId);
            
            // 商品IDを抽出（dp/XXXXXXXXまたはgp/product/XXXXXXXX形式）
            let productIdMatch = path.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/);
            
            if (!productIdMatch) {
                // 一般的なページの場合は単純にタグを追加
                return `https://www.amazon.co.jp${path}?${params.toString()}#PR`;
            }
            
            // 商品ページの場合は整形したURLを返す
            let productType = productIdMatch[1];
            let productId = productIdMatch[2];
            
            if (productType === 'dp') {
                return `https://www.amazon.co.jp/dp/${productId}?${params.toString()}#PR`;
            } else {
                return `https://www.amazon.co.jp/gp/product/${productId}?${params.toString()}#PR`;
            }
            
        } catch (error) {
            console.error('URL変換エラー:', error);
            alert('URLの形式が正しくありません');
            return url;
        }
    }
});
