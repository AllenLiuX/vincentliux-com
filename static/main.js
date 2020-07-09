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
    if(j>=500){
        direction = -1;
    }
    else if (j<=15){
        direction = 1;
        let backs = ['../images/back2.JPG', '../images/back3.jpg', '../images/back4.jpg'];
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