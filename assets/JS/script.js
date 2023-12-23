$(document).ready(function () {
    $('.togglebar').on('click', function () {
        $('ul').toggleClass('active')
        $('header.navigation').toggleClass('active')
    })

    $('.home').on('click', function () {
        window.location.href = 'index.html'
    })

    $('.tentang').on('click', function () {
        $('.gambar-about')[0].scrollIntoView()
    })
    $('.kontak').on('click', function () {
        $('.social-media')[0].scrollIntoView()
    })
    $('.keluar').on('click', function () {
        window.location.replace('logout.html')
    })

    if ($('.modal.is-hidden').length > 0) {
        $('#modal-layout').on('click', function (e) {
            console.log(e.target.id)
            if (e.target.id == 'modal-layout') {
                showModal()
            }
        })
    }
})

function toggle_reset() {
    $('#jdlanime').val('')
    $('#rate').val('')
    $('#comment').val('')
}

function showModalProfile(num = 0){
    selectorProfile = $('.card-fanbook #profile')
    selectorProfileText = $(`.card-fanbook #nickname${num}`)
    selectorModal = $('#modal-layout img')
    selectorModalText = $('#modal-layout #caption')
    console.log(num)
    
    if ((num === 0) && (num >= selectorProfile.length)) {
        return;
    }
    let imageSrc = selectorProfile[num-1]
    caption_receive = selectorProfileText.text()
    console.log(caption_receive)
    console.log(imageSrc['src'])

    if (imageSrc['src'] === '') {
        console.log('Gagal mengambil gambar');
        return
    }
    console.log('success mengambil Gambar');
    selectorModal.prop('src',imageSrc['src']) 
    selectorModalText.text(caption_receive)
    showModal('profile')
}

function showModal(arg1 = 'logo') {
    selectorDefault = $('.navigation .logo img')
    selectorDefaultText = $('.navigation .logo h2')
    selectorModal = $('#modal-layout img')
    selectorModalText = $('#modal-layout #caption')
    imageSrcDefault = selectorDefault[0]['src']
    console.log(arg1)
    if (arg1 === 'profile') {
        return $('#modal-layout').toggleClass('is-hidden')
    }
    selectorModal.prop('src', imageSrcDefault)
    selectorModalText.text(selectorDefaultText.text())
    return $('#modal-layout').toggleClass('is-hidden')
}

function toggle_kirim() {
    $('.template').hide()
    let count = 1
    selectorProfile = $('.card-fanbook #profile')
    selectorProfileText = $(`.card-fanbook h3`)
    selectorjdlanime = $('#jdlanime')
    selectorrate = $('#rate')
    selectorcomment = $('#comment')
    selectorNama = $('h2')
    nama_receive = selectorNama.text()
    jdlanime_receive = selectorjdlanime.val()
    rate_receive = selectorrate.val()
    comment_receive = selectorcomment.val()

    if (jdlanime_receive === '') {
        alert('Judul Anime anda kosong silahkan masukkan')
        selectorjdlanime.focus()
        return
    }

    if (rate_receive === null) {
        alert('Rating anda belum dipilih')
        selectorrate.focus()
        return;

    }

    if (comment_receive === '') {
        alert('Komentar anda kosong silahkan masukkan')
        selectorcomment.focus()
        return;
    }

    $.ajax({
        type: 'GET',
        url: `https://kitsu.io/api/edge/anime?filter[text]=${jdlanime_receive}`,
        success: function (response) {
            if (response.data.length === 0) {
                alert('Anime yang anda cari tidak ada')
                selectorjdlanime.focus()
                return;
            }

            const datas = response.data
            rates_receive = '★'.repeat(parseInt(rate_receive));
            console.log(nama_receive)
            let temp_html = ''
            let title_anime = ''
            let title_anime1 = ''
            let title_anime2 = ''
            let alert_keyword = ''
            let image_anime = ''
            // bikin for terhadap panjang data yang dikasih
            // perbandingan data dengan judul anime dengan cara membuat uppercase
            // jika beda continue jika sama jalankan    

            for (let index = 0; index < datas.length; index++) {
                let data = datas[index];
                title_anime1 = data.attributes.titles.en_jp;
                title_anime2 = data.attributes.slug.split('-').join(' ');
                console.log(jdlanime_receive,title_anime1, title_anime2)
                console.log("match1 =",jdlanime_receive.toLowerCase().match(title_anime1.toLowerCase()))
                console.log('match2 =',jdlanime_receive.toLowerCase().match(title_anime2.toLowerCase()))
                alert_keyword += `"${title_anime1} / ${title_anime2}", `
                
                if ((jdlanime_receive.toLowerCase().match(title_anime1.toLowerCase()) === null) && !(jdlanime_receive.toLowerCase().match(title_anime2.toLowerCase()))) continue;
                
                console.log('success')
                image_anime = data.attributes.posterImage.medium;
                title_anime = data.attributes.canonicalTitle
            }
            if (!title_anime && !image_anime) {
                return alert(`Keyword yang anda cari salah mungkin maksud anda ${alert_keyword}`)
            }
            temp_html += `
            <section class="card-fanbook">
                <header class="jdl-anime">
                    <img src=${image_anime} alt="gambar-anime.png" />
                    <h1>${title_anime}</h1>
                </header>
                <section class="show-akun">
                    <img src="assets/img/profile-2023-10-15-18-06-10.jpg" id="profile" onclick="showModalProfile(${count+selectorProfile.length})" alt="profile-akun.png">
                    <h3 id="nickname${count+selectorProfileText.length}">${nama_receive}</h3>
                    <p>${rates_receive}</p>
                </section>
                <section class="show-comment">
                    <p>${comment_receive}</p>
                </section>
            </section>
            `
            $('#showfanbook').append(temp_html);
        }
    })

    $('#jdlanime').val('')
    $('#rate').val('')
    $('#comment').val('')
}

