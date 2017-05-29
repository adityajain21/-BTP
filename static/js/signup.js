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

function call_for_server_check_register(params){
    $.ajax({
        url: '/server-compute-register',
        data: params,
        type: "POST",
        success: function(response){
            console.log("B1 | " + response['B1'])
            console.log("B2 | " + response['B2'])
            console.log("ei | " + response['ei'])
            console.log("p | " + response['p'])
            var _B1 = response['B1'] ^ response['ri'];
            var _B2 = response['B2'] ^ response['ri'];
            console.log("B1* | " + _B1)
            console.log("B2* | " + _B2)
            alert("USER REGISTERED SUCCESSFULLY!");
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
    var id = form_data[0]['value'];
    var email_address = form_data[1]['value'];
    var password = form_data[2]['value'];

    var ri = parseInt(Math.random() * 1000000);

    var hi = md5(password) ^ ri ;

    console.log("hi | " + hi);


    if($("#bio_flag").val() != 1){
        alert("Biometric Upload Failed! Please try again!");
    } else {
        $.ajax({
            url: '/login_submit',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                var params = {
                    ri : ri,
                    id : id,
                    hi : hi,
                };

                // $("#client_computations").val(new_message);
                wait(1000);
                call_for_server_check_register(params);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});
