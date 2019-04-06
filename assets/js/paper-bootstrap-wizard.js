searchVisible = 0;
transparent = true;

$(document).ready(function () {

    createPostcodeList();

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
        rules: {
            firstname: {
                required: true,
                minlength: 3
            },
            lastname: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true
            },
            number: {
                required: true,
                number: true,
                minlength: 10
            },
            contactTime: {
                required: true
            },
            postcode: {
                required: true
            },
            state: {
                required: true,
            },
            healthProvider: {
                required: true
            }
        },
    });

    $('#nib').click(function () {
        $("div#health-selector select").val("NIB Health Funds Ltd");
    });
    $('#hbf').click(function () {
        $("div#health-selector select").val("HBF Health Limited");
    });
    $('#hcf').click(function () {
        $("div#health-selector select").val("HCF");
    });
    $('#medibank').click(function () {
        $("div#health-selector select").val("Medibank Private Limited");
    });
    $('#bupa').click(function () {
        $("div#health-selector select").val("Bupa");
    });
    $('#teachers').click(function () {
        $("div#health-selector select").val("Teachers Health");
    });

    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            }
        },

        onInit: function (tab, navigation, index) {

            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            $width = 100 / $total;

            navigation.find('li').css('width', $width + '%');

        },

        onTabClick: function (tab, navigation, index) {

            var $valid = $('.wizard-card form').valid();

            if (!$valid) {
                return false;
            } else {
                return true;
            }

        },

        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if ($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            //update progress
            var move_distance = 100 / $total;
            move_distance = move_distance * (index) + move_distance / 2;

            $wizard.find($('.progress-bar')).css({width: move_distance + '%'});
            //e.relatedTarget // previous tab

            $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');

        }
    });


    // Prepare the preview for profile picture
    $("#wizard-picture").change(function () {
        readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function () {
        wizard = $(this).closest('.wizard-card');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked', 'true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});


//Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}


function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};

//-------------Search Postcodes Code --------------------------//

var locations = [
    {id: 1, postcode: 3050, suburb: "Royal Melbourne Hospital", state: "VIC"},
    {id: 2, postcode: 3051, suburb: "Hotham Hill", state: "VIC"},
    {id: 3, postcode: 3052, suburb: "Parkville", state: "VIC"},
    {id: 4, postcode: 3053, suburb: "Carlton", state: "VIC"},
    {id: 5, postcode: 3054, suburb: "Princess Hill", state: "VIC"},
    {id: 6, postcode: 3055, suburb: "Moonee Vale", state: "VIC"},
    {id: 7, postcode: 3056, suburb: "Brunswick", state: "VIC"},
    {id: 8, postcode: 3057, suburb: "Sumner", state: "VIC"},
    {id: 9, postcode: 3058, suburb: "Coburg", state: "VIC"},
    {id: 10, postcode: 3059, suburb: "Greenvale", state: "VIC"}
];

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function createPostcodeList() {
    for (let i = 0; i < locations.length; i++) {

        var locationString = locations[i].postcode + " " + locations[i].suburb + " " + locations[i].state;

        $('.dropdown-content').append("<span class='searchItem' onclick='setValue(event)'>" + locationString + "</span>")
    }
}

function setValue(e) {
    e = e || window.event;
    document.getElementById("myInput").value = e.target.innerHTML;
    var div = document.getElementById("myDropdown");
    var a = div.getElementsByTagName("span");
    for (let i = 0; i < a.length; i++) {
        a[i].classList.remove("searchShow");
    }
}

function checkDisclaimer() {
    if (document.getElementById("disclaimer").checked) {
        document.getElementById("finish").disabled = false;
    } else {
        document.getElementById("finish").disabled = true;
    }
}

function filterFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    var div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("span");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1 && filter.length > 0) {
            a[i].classList.add("searchShow");
        } else {
            a[i].classList.remove("searchShow");
        }
    }
}

// ---------------------------Old Submit Method----------------------------

// function formSubmitted() {
//     document.body.innerHTML = '<div><div class="col-sm-6 col-sm-offset-3 submitted"><h1>Awesome Job and Welcome to the Club!</h1><h5>Don’t worry, you haven’t joined some strange Sumo Wrestling Club…You have now joined the 20% of Australians who regularly compare and SAVE on Energy or Health Insurance. We call it the Savvy Saver Club! But more about that later…</h5></div></div>';
// }