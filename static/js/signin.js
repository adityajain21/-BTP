function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function XOR(a,b) {
  return ( a || b ) && !( a && b );
}

function call_for_server_check(params, c3, ui){
    var form_data = $('form').serializeArray();
    var email_address = form_data[0]['value'];
    $.ajax({
        url: '/server-compute',
        data: params,
        type: "POST",
        success: function(response){
            // $(".jumbotron").hide(500);
            console.log(response);
            console.log("c10 | " + response['c10'])
            var c9c = c3 ^ ui;
            var e1c = response['c8'];
            var c10c = md5(email_address + response['c6'] + response['c8'] + c9c + response['key'] + e1c);
            alert("USER LOGGED IN SUCCESSFULLY!");
        }
    });
}


$('#btnUploadBio').click(function(){
    $("body").find("#bio_flag").val("1");
    $.ajax({
        url: '/upload-bio',
    });
});

$('#btnSignUp').click(function(){
    var form_data = $('form').serializeArray();

    var email_address = form_data[0]['value'];
    var password = form_data[1]['value'];

    var c1 = parseInt(Math.random() * 1000000);
    var ui = parseInt(Math.random() * 1000000);
    var ei = parseInt(Math.random() * 1000000);

    var c3 = md5(password);

    var c2 = c3 ^ md5(email_address + ei);
        c2 = c2 ^ ui;
        c2 = md5(c2);

    var c4 = md5(c1.toString() + c2 + c3 + ui);
    var c5 = md5(email_address + c4);



    console.log("c1 | " + c1);
    console.log("c2 | " + c2);
    console.log("c3 | " + c3);
    console.log("c4 | " + c4);
    console.log("c5 | " + c5);


    if($("#bio_flag").val() != 1){
        alert("Biometric Upload Failed! Please try again!");
    } else {
        $.ajax({
            url: '/login_submit',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                var params = {
                    c1 : c1,
                    c2 : c2,
                    c5 : c5,
                    ei : ei,
                    email_address : email_address,
                    c4 : c4,
                };

                // $("#client_computations").val(new_message);
                wait(1000);
                call_for_server_check(params, c3, ui);

            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});
