let i = 0;
let j = 500;
let direction = -1;

function background(){
    // changeId = setInterval(change, 3000);   //check the options every 3 second
    optId = setInterval(opt, 4);
    // $("#background").attr('src', 'images/back.JPG');
}

// function change(){
//     let backs = ['images/back2.JPG', 'images/back.JPG'];
//     i = (i+1)%backs.length;
//     $("#background").attr('src', backs[i]);
// }

function opt(){
    if($('#cmn-toggle-4').prop('checked')){
        $("#dark").css('color','#ffffff');
        $(".content").css('background', 'linear-gradient(45deg, #000000 80%, #7a4a00)');
        $(".content-text").css('color','#ffffff');
        $(".content2").css('color','#ffffff');
        $(".content3").css('color','#ffffff');
        $(".content-text b").css('color','#af7a00');
        $(".expand").css('background','#bf7b00');
        $('.expand').css('box-shadow','0px 0px 6px 1.5px rgba(200,150,0,0.6)');
        $('.content-title').css('color', '#ffffff');
        $(".timeline-content").css('background','#000000');
        $(".timeline-item").css('color','#ffffff');
        $('.timeline-content').css('box-shadow','0px 15px 20px -5px rgba(200,150,0,0.6)');
        $('body').css('background','#000000');
        $('.content').css('box-shadow','0px 16px 26px 0px rgba(200,150,0,0.6)');
        $("#artlist a").css('color','#ffffff');
        $('#foo').attr('class', 'm-0 text-center text-white-50');
        $('#foo2').attr('class', 'm-0 text-center text-white-50');
    }
    else{
        $("#dark").css('color','#5f20b5');
        $(".content").css('background', 'linear-gradient(45deg, #cfedef 60%, #ffffff)');
        $(".content-text").css('color','#000000');
        $(".content2").css('color','#000000');
        $(".content3").css('color','#000000');
        $(".content-text b").css('color','#3f51b5');
        $(".expand").css('background','#ff4081');
        $('.expand').css('box-shadow','0px 0px 6px 1.5px rgba(230,0,0,0.6)');
        $('.content-title').css('color', '#2D93CA');
        $(".timeline-content").css('background','#ffffff');
        $(".timeline-item").css('color','#000000');
        $('.timeline-content').css('box-shadow','0 20px 25px -15px rgba(100, 100, 115, 0.6)');
        $('body').css('background','#ffffff');
        $('.content').css('box-shadow','0px 16px 26px 0px rgba(0,0,0,0.3)');
        $("#artlist a").css('color','#000000');
        $('#foo').attr('class', 'm-0 text-center text-black-50');
        $('#foo2').attr('class', 'm-0 text-center text-black-50');
    }


    if(j>=500){
        direction = -1;
    }
    else if (j<=15){
        direction = 1;
        let backs = ['images/back2.JPG', 'images/back3.jpg', 'images/back4.jpg'];
        i = (i+1)%backs.length;
        $("#background").attr('src', backs[i]);
    }
    j += 1*direction;
    // console.log(j);
    let op = 1;
    if (j<60){
        op = j/80;
    }
    $("#background").css('opacity', op);
    // $("#background").css('background-color', "rgba(0,0,0,"+op+")");
}

$(function () {
    window.sr = ScrollReveal();

    if ($(window).width() < 768) {
        if ($(".timeline-content").hasClass("js--fadeInLeft")) {
            $(".timeline-content")
                .removeClass("js--fadeInLeft")
                .addClass("js--fadeInRight");
        }

        sr.reveal(".js--fadeInRight", {
            origin: "right",
            distance: "300px",
            easing: "ease-in-out",
            duration: 800
        });
    } else {
        sr.reveal(".js--fadeInLeft", {
            origin: "left",
            distance: "300px",
            easing: "ease-in-out",
            duration: 800
        });

        sr.reveal(".js--fadeInRight", {
            origin: "right",
            distance: "300px",
            easing: "ease-in-out",
            duration: 800
        });
    }

    sr.reveal(".js--fadeInLeft", {
        origin: "left",
        distance: "300px",
        easing: "ease-in-out",
        duration: 800
    });

    sr.reveal(".js--fadeInRight", {
        origin: "right",
        distance: "300px",
        easing: "ease-in-out",
        duration: 800
    });
});


$("#cmn-toggle-4").click(function () {
    if ($(this).prop("checked")) {//jquery 1.6以前版本 用  $(this).attr("checked")
        alert("选中");
        $(".content").css('background', 'linear-gradient(45deg, #000000 80%, #7a4a00)');
    } else {
        alert("没有选中");
    }
});

$("#ch1").click(function () {
    if ($(this).prop("checked")) {//jquery 1.6以前版本 用  $(this).attr("checked")
        $(".content").css('background', 'linear-gradient(45deg, #000000 80%, #7a4a00)');
        alert("选中");
    } else {
        alert("没有选中");
    }
});
