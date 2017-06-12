function countToIcoStart(countDownDate) {
    var $days = $('.ico-section .days .digits');
    var $hours = $('.ico-section .hours .digits');
    var $minutes = $('.ico-section .minutes .digits');
    var $seconds = $('.ico-section .seconds .digits');

    var x = setInterval(function () {
        var now = window.now;
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $days.html(days < 10 ? '0' + days : days);
        $hours.html(hours < 10 ? '0' + hours : hours);
        $minutes.html(minutes < 10 ? '0' + minutes : minutes);
        $seconds.html(seconds < 10 ? '0' + seconds : seconds);

        if (window.innerWidth <= 992 && days == 0) {
            $days.parent().toggleClass('hidden-md-down', true);
            $seconds.parent().toggleClass('hidden-md-down', false);
        }

        if (distance <= 0) {
            clearInterval(x);
            startIco();
        }

    }, 1000);
}

function countToIcoEnd() {
    var countDownDate = window.icoEndTime;
    var $el = $('.time-remaining .stats-value');
    var x = setInterval(function () {
        var now = window.now;
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 1)
            return $el.text(days + ' Days');

        if (hours > 1)
            return $el.text(hours + ' Hours');

        if (minutes >= 1)
            return $el.text(minutes + 1 + ' Minutes');

        if (seconds >= 0)
            return $el.text(seconds + ' Seconds');

        if (distance < 0) {
            $el.text('--');
            clearInterval(x);
            stopIco();
        }

    }, 1000);
}

function countToIcoPhase1End() {
    var countDownDate = window.icoPhase1EndTime;

    var $hours = $('.phase1-time-remaining .hours');
    var $minutes = $('.phase1-time-remaining .minutes');
    var $seconds = $('.phase1-time-remaining .seconds');

    var x = setInterval(function () {
        var now = window.now;
        var distance = countDownDate - now;

        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $hours.html(hours < 10 ? '0' + hours : hours);
        $minutes.html(minutes < 10 ? '0' + minutes : minutes);
        $seconds.html(seconds < 10 ? '0' + seconds : seconds);


        if (distance < 0) {
            clearInterval(x);
            startIco();
        }

    }, 1000);
}

$(document).ready(function () {
    var countDownDate = window.icoTime;

    var icoState = getIcoState();

    if (icoState == 'during-ico-phase1' || icoState == 'during-ico')
        return startIco();

    countToIcoStart(countDownDate);
});
