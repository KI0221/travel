$(document).ready(function () {
    let map;
    let geocoder;

    // Googleマップを初期化する
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            // 東京を中心に表示させるため。東京の緯度経度
            center: {lat: 35.6895, lng: 139.6917}, 
            zoom: 8
        });
        geocoder = new google.maps.Geocoder();
    }

    $('#randomBtn').click(function(){
    // ランダムな郵便番号を作る
    const randomPostalCode = NewRandomPostalCode();
    $('#postalCode').text(`郵便番号:${randomPostalCode}`);

    // 郵便番号から住所を取得する（郵便番号APIを利用する）
    $.getJSON(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${randomPostalCode}`,function(data){
        if (data.results) {
            // 複数の部分（都道府県、市区町村、町域）を連結させる
            const address = data.results[0].address1 + data.results[0].address2 + data.results[0].address3;
            // 住所を表示させる
            $('#address').text(`住所: ${address}`);
            // マップを表示させる
            geocodeAddress(geocoder, map, address);
        } else {
            $('#address').text('住所が見つかりません');
        }
    }).fail(function() {
        $('#address').text('エラーが発生しました');
    });
    });

    function NewRandomPostalCode(){
        // 生成された郵便番号を格納する変数を初期化する
        let postalCode = '';
        // ７桁の数字をランダムに作成する
        for(let i = 0; i < 7 ; i ++){
        // 0から９までのランダムな整数を生成し、postalCodeに表示する
        postalCode += Math.floor(Math.random()*10)
        }
        return postalCode;            
    }

    // geocoder: Google Maps Geocoderオブジェクト
    // resultsMap: Google Mapsオブジェクト
    // address: ジオコードする住所
    function geocodeAddress(geocoder, resultsMap, address) {
        geocoder.geocode({'address': address}, function(results, status) {
            // ジオコードのリクエストがOKの場合、対象の住所を地図の中心に表示させ、地図上に新しいマーカーを表示させる
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            // ジオコードのリクエストがNGだった場合、エラーを表示させる
            } else {
                alert('Geocode was not successful');
            }
        });
    }

    // Googleマップを初期化させるためのコールバックを定義
    window.initMap = initMap;
});

