$(document).ready( () => {
    /* SAVE REPLY MSG TO DB VIA ENTER
    $(function() {
        $('#reply_msg').keypress(function (event) {
            let replylen = ($('#reply_msg')[0].value).length;
            if (event.which == 13 && replylen > 0) {
                event.preventDefault();
                document.getElementById("message-reply-box").style.bottom = "-10em";
                
                $.ajax({
                    url: "{{ url_for('main.reply_message'|safe, subject=msg_subj, recip_id=other_user.id) }}",
                    data: JSON.stringify(),
                    type: 'POST',
                    contentType: 'application/json',
                    success: function(response) {
                        console.log('it worked...')
                    }
                });
            };
        });
    }); */
});