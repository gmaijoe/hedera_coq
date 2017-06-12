$ELEMETNS = {}; // For elemnts cache

function showFormError($input, error) {
    $inputGroup = $input.parents('.input-group-1');
    $inputGroup.addClass('error');
    $inputGroup.append('<div class="input-error-msg">' + error + '</div>');
}

function clearFormErrors($el) {
    $inputGroup = $el.find('.input-group-1');
    $inputGroup.removeClass('error');
    $inputGroup.find('.input-error-msg').remove();
}

function getUrlHash() {
    return window.location.hash;
}

function textHighlight($el, time) {
    $el.addClass('text-highlight-shadow');
    setTimeout(function () {
        $el.removeClass('text-highlight-shadow');
    }, time || 300);
}

function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function toggleMenu(e, open) {
    $('.menu-toggle').toggleClass('active', open);
    if (e)
        e.stopPropagation();
}

function toggleCollapsible() {
    $(this).parents('.collapsible').toggleClass('active');
}

function onScrollToClick() {
    var scrollToEl = this.dataset.scrollto;
    scrollToElement(scrollToEl);
}

function scrollToElement(selector) {
    var scrollTo = $(selector).offset().top; //isLargeScreen() ? $(scrollToEl).offset().top - 96 :
    var headerHeight = $('header .nav-bar').height();

    $('html, body').animate({ scrollTop: scrollTo - headerHeight }, 800);
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function showTooltip($el, text) {
    $el.find('.tooltip .tooltip-content').text(text);
    $el.find('.tooltip').addClass('active');

    window.tooltipTimeout = setTimeout(function () {
        $el.find('.tooltip').removeClass('active');
        clearTimeout(window.tooltipTimeout);
    }, 2500);
}

function onNotebookItemClick() {
    $notebook = $(this).parents('.notebook');
    $notebook.find('.notebook-pager li').removeClass('active');
    $(this).addClass('active');
    var target = $(this).data('target');

    $notebook.find('.notebook-content li').removeClass('active');
    $notebook.find('.notebook-content ' + target).addClass('active');
}

function onMenuItemDropdownClick() {
    $(this).toggleClass('active');
}

function onLangChange() {
    var lang = this.value;
    if (lang == 'cn') return window.location = '/cn';

    setCookie('lang', lang);
    window.location.reload();
}

// Set cookie
function setCookie(name, value) {
    document.cookie = name + '=' + value + '; path=/';
}

// Read cookie
function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function postRequest(url, data, cb) {
    $.ajax({
        type: 'POST',
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            cb(data);
        }
    });
}

function getRequest(url, cb) {
    $.get(url, cb);
}

function setCurrentLang() {
    var lang = readCookie('lang') || 'en';
    $('header .lang-changer select').val(lang);
}

function setLang(lang) {
    $('header .lang-changer select').val(lang);
    setCookie('lang', lang);
}

function getEnv() {
    return window.ENV || 'development';
}

function getApiBaseUrl() {
    const env = getEnv();

    if (env == 'development' || window.location.hostname == 'localhost')
        return '//localhost:3000/0.1';

    return '//api.' + window.location.hostname + '/0.1';
}

var IS_SUBSCRIBING = false;
function onSubscribe(e) {
    if (IS_SUBSCRIBING) return;

    e.preventDefault();
    var $el = $(this);

    clearFormErrors($el);

    var $email = $el.find('.email');
    var email = $email.val();

    var isValid = validateEmail(email);
    if (!isValid) return showFormError($email, 'Invalid Email');

    ga('send', 'event', 'SubscribeForm', 'submit', email);

    $el.addClass('loading');
    $.ajax({
        url: '/subscribe',
        type: 'post',
        dataType: 'json',
        success: function (data) {
            IS_SUBSCRIBING = false;
            $el.removeClass('loading');

            if (!data.success) return showFormError($email, data.error);

            $el.addClass('success');
        },
        data: { email: email }
    });
    IS_SUBSCRIBING = true;
}

function getIcoState() {
    var icoTime = window.icoTime;
    var icoPhase1EndTime = window.icoPhase1EndTime;
    var icoEndTime = window.icoEndTime;
    var now = window.now;

    if (now < icoTime) return 'pre-ico';
    if (now > icoTime && now < icoPhase1EndTime) return 'during-ico-phase1';
    if (now > icoPhase1EndTime && now < icoEndTime) return 'during-ico';
    if (now > icoEndTime) return 'post-ico';
}

function formatNumber(amount) {
    var startFormattingAt = 999;
    var million = 1000000;
    var billion = 1000000000;

    if (amount >= startFormattingAt && amount < million) return Number.parseFloat((amount / 1000).toFixed(1)) + 'K';
    if (amount >= million && amount < billion) return Number.parseFloat((amount / million).toFixed(1)) + 'M';
    return roundNumber(amount).toLocaleString();
}

function roundNumber(number, decimal) {
    var decimalPlaces = decimal || 2;
    return +(Math.round(number + 'e+' + decimalPlaces) + 'e-' + decimalPlaces);
}

$.ajaxSetup({ cache: false });

$(document).ready(function () {
    // cache elements
    $ELEMETNS.header = $('header');
    $ELEMETNS.videoGallery = $('.video-gallery');

    $('header .menu-item.dropdown').click(onMenuItemDropdownClick);
    $('header .lang-changer select').change(onLangChange);
    $('[data-scrollTo]').click(onScrollToClick);
    $('.menu-toggle').click(toggleMenu);
    $('.collapsible-toggle').click(toggleCollapsible);
    $('.notebook-pager.notebook-click li').click(onNotebookItemClick);
    $('.notebook-pager.notebook-hover li').hover(onNotebookItemClick);
    $('.subscribe-form').submit(onSubscribe);

    $('.tip').tipr();

    var lang = getQueryParameterByName('lang');
    if (lang)
        setLang(lang);
    else
        setCurrentLang();
    // $(window).scroll(onScroll);
});