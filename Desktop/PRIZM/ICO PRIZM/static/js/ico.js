function fetchEthAmountRasied() {
    var ETHcrowdsaleChangerAddress = window.ETHcrowdsaleChangerAddress;
    var ETHtokenAddress = window.ETHtokenAddress;

    var apiBaseUrl = getApiBaseUrl();
    var url = apiBaseUrl + '/transactions/crowdsaleInfo?crowdsaleChangerAddress=' + ETHcrowdsaleChangerAddress + '&tokenAddress=' + ETHtokenAddress;

    getRequest(url, function (data) {
        if (!data && !data.data) return;

        var crowdsaleEtherContributed = data.data.crowdsaleEtherContributed;
        var totalEtherCap = data.data.totalEtherCap;
        var totalBancorSupply = data.data.totalSupply;
        var icoState = getIcoState();

        if (totalBancorSupply)
            updateTotalBancorSupply(totalBancorSupply);

        if (crowdsaleEtherContributed)
            updateAmountRaised('eth', crowdsaleEtherContributed);

        if (totalEtherCap && icoState == 'during-ico') {
            updateTotalEtherCap(totalEtherCap);

            if (parseFloat(crowdsaleEtherContributed) >= parseFloat(totalEtherCap))
                stopIco();
        }
    });
}

function updateTotalEtherCap(cap) {
    $('.eth-cap .stats-value').text(parseInt(cap).toLocaleString());
}

function updateTotalBancorSupply(supply) {
    var supplyFormated = formatNumber(supply);
    var $el = $('.token-issued .stats-value');

    if ($el.text() != supplyFormated)
        textHighlight($el);

    $el.text(supplyFormated);
}

function fetchCoinsAmountRaised() {
    fetchEthAmountRasied();
    var randomMil = Math.floor(Math.random() * ((10000 - 8000) + 1) + 8000); // random between 8 to 10 seconds
    window.fetchCoinsAmountRaisedInterval = setInterval(function () {
        fetchEthAmountRasied();
    }, randomMil);
}

function updateAmountRaised(coin, balance) {
    window[coin.toUpperCase() + 'totalRaised'] = balance;

    var $el = $('.' + coin + '-raised .stats-value');
    var balanceFormated = parseInt(balance).toLocaleString();

    if ($el.text() != balanceFormated)
        textHighlight($el);

    $el.text(balanceFormated);

    updateTotalUSD();
}

function calculateTotalRaisedUSD() {
    return window.ETHtotalRaised * window.ETHexchangeRate;
}

function updateTotalUSD(coin, balance) {
    var $el = $('.usd-raised .stats-value');
    var totalUSD = calculateTotalRaisedUSD();

    if (!totalUSD) return;

    var totalUSDFormated = '$' + formatNumber(totalUSD);

    if ($el.text() != totalUSDFormated)
        textHighlight($el);

    $el.text(totalUSDFormated);
}

function setPieChart(selector, series) {
    window.Highcharts.chart(selector, {
        title: false,
        tooltip: { enabled: false },
        chart: {
            backgroundColor: 'transparent',
            type: 'pie'
        },
        credits: {
            enabled: false
        },
        exporting: { enabled: false },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    useHTML: true,
                    enabled: true,
                    format: '<div style="text-align:center;">{point.y:.2f}%</div><div style="text-align:center;white-space: normal;font-weight:400;">{point.name}</div>'
                }
            }
        },
        // tooltip: {
        //     headerFormat: '',
        //     pointFormat: '<span>{point.name}:</span><br><b>{point.y:.2f}%</b> of total<br/>'
        // },
        series: series
    });
}

function setProceedsUsesChart() {
    var series = [{
        name: 'Token Allocation',
        data: [{
            name: 'Fundraiser',
            y: 50
        }, {
            name: '<div style="width:150px;">Team (current and future), Advisors and Early Contributors</div>',
            y: 10
        }, {
            name: 'Long-term Foundation Budget',
            y: 20
        }, {
            name: '<div style="width:150px;">Community Grants, Partnerships & Bounties</div>',
            y: 20
        }]
    }];

    setPieChart('proceeds-uses-chart', series);
}

function setTokenAllocationChart() {
    var series = [{
        name: 'Use of Proceeds',
        data: [{
            name: 'Software Development',
            y: 40
        }, {
            name: 'Misc and Unexpected',
            y: 5
        }, {
            name: 'Legal Expenses',
            y: 5
        }, {
            name: 'Operational Expenses',
            y: 8
        }, {
            name: 'Seeding Token Changers and ETFs',
            y: 10
        }, {
            name: 'Marketing and Business Development',
            y: 12
        }, {
            name: 'ETH Reserve (CRR)',
            y: 20
        }]
    }];

    setPieChart('token-allocation-chart', series);
}

function setCrowdsaleAddress() {
    $('.eth-address').text(window.CONTRACT_ADDRESS);
}

function startIco() {
    var icoState = getIcoState();

    $('body').removeClass('pre-ico during-ico during-ico-phase1').addClass(icoState);
    fetchCoinsAmountRaised();

    if (icoState == 'during-ico-phase1')
        return countToIcoPhase1End();

    return countToIcoEnd();
}

function stopIco() {
    $('body').removeClass('during-ico during-ico-phase1').addClass('post-ico');
    clearInterval(window.fetchCoinsAmountRaisedInterval);
}

$(document).ready(function () {
    setCrowdsaleAddress();

    setTokenAllocationChart();
    setProceedsUsesChart();

    $('.quotes-section .quotes').lightSlider({
        item: 1,
        enableDrag: false,
        controls: false,
        loop: true,
        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        speed: 1500,
        auto: true,
        pause: 7000,
        mode: 'fade'
    });

    $('.token-option').click(function () {
        $('.token-option').removeClass('active');
        $(this).addClass('active');

        var token = $(this).attr('data-token-option');
        $('.selected-token').text(token);
        $('.contribute-tokens-info img').attr('src', '/static/images/token_sale/' + token.toLowerCase() + '.png');

        $('.token-address').text(window[token + 'crowdsaleAddress']);
        $('.selected-token-usd-rate').text('$' + window[token + 'exchangeRate']);

        $('.contribute-tokens-info-subtitle').text(token != 'eth' ? 'Token Changers' : 'FOUNDATION BUDGET');
    })

    $('.available-tokens .btn').click(function () {
        $('.contribute-tokens-form').attr('data-current-step', 2);
    })

    $('.contribute-tokens-form-step2-topbar i').click(function () {
        $('.contribute-tokens-form').attr('data-current-step', 1);
    })

    $('.token-option').first().click();
    $('.videos-section .video-thumbnails').lightSlider({
        item: 4,
        loop: false,
        enableDrag: true,
        controls: false,
        pager: false,
        slideMove: 1,
        slideMargin: 32,
        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        speed: 600,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    item: 3,
                    slideMargin: 16
                }
            },
            {
                breakpoint: 480,
                settings: {
                    autoWidth: false,
                    slideMargin: 8,
                    item: 1.25
                }
            }
        ]
    });
});

